import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type Message, type ChatRequest } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useProgressStats } from "@/hooks/use-progress";

export function useChatHistory(mode: string) {
  return useQuery({
    queryKey: [api.chat.history.path, mode],
    queryFn: async () => {
      // Validate mode against expected enum implicitly by routing logic, 
      // but API handles validation.
      const url = buildUrl(api.chat.history.path, { mode });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch chat history");
      return api.chat.history.responses[200].parse(await res.json());
    },
    // Refresh often to keep chat feeling alive, or rely on manual invalidation
    staleTime: 1000 * 60, 
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { addMessage } = useProgressStats();

  return useMutation({
    mutationFn: async (data: ChatRequest) => {
      const validated = api.chat.send.input.parse(data);
      const res = await fetch(api.chat.send.path, {
        method: api.chat.send.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to send message");
      }

      const response = api.chat.send.responses[200].parse(await res.json());
      return response;
    },
    onMutate: async (newChat) => {
      // Optimistic update
      const queryKey = [api.chat.history.path, newChat.mode];
      await queryClient.cancelQueries({ queryKey });

      const previousMessages = queryClient.getQueryData<Message[]>(queryKey);

      // Create a temporary optimistic message
      const optimisticMessage: Message = {
        id: -1, // temporary ID
        userId: undefined,
        role: "user",
        content: newChat.message,
        mode: newChat.mode,
        createdAt: new Date().toISOString(),
      };

      if (previousMessages) {
        queryClient.setQueryData<Message[]>(queryKey, [
          ...previousMessages,
          optimisticMessage,
        ]);
      }

      return { previousMessages };
    },
    onError: (err, newChat, context) => {
      // Rollback
      if (context?.previousMessages) {
        queryClient.setQueryData(
          [api.chat.history.path, newChat.mode],
          context.previousMessages
        );
      }
      toast({
        title: "Error sending message",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess: (data, variables) => {
      // Track message in progress stats
      addMessage();
      
      // Invalidate to get the real message ID and the AI response if it was saved by backend
      // But actually, for a chat app, we often want to append the response immediately if the API returns it.
      // The current API contract returns { message: string, role: 'assistant' }
      
      const queryKey = [api.chat.history.path, variables.mode];
      
      queryClient.setQueryData<Message[]>(queryKey, (old) => {
        if (!old) return [];
        // Replace optimistic user message with real one? 
        // Or just append the assistant response since we are invalidating anyway?
        // Let's rely on invalidation for the source of truth to ensure IDs are correct
        return old;
      });
      
      return queryClient.invalidateQueries({ queryKey });
    },
  });
}

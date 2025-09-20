import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
interface ConversationBarProps {
  onTextMessage: (message: string) => void;
  onVoiceToggle: () => void;
  isVoiceActive: boolean;
  disabled?: boolean;
}
export const ConversationBar = ({
  onTextMessage,
  onVoiceToggle,
  isVoiceActive,
  disabled = false
}: ConversationBarProps) => {
  const [textInput, setTextInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {
    toast
  } = useToast();
  const handleSendText = async () => {
    if (!textInput.trim() || isLoading) return;
    try {
      setIsLoading(true);
      await onTextMessage(textInput.trim());
      setTextInput("");
      toast({
        title: "Mensaje enviado",
        description: "Procesando tu consulta..."
      });
    } catch (error) {
      console.error('Error sending text message:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };
  const handleVoiceClick = () => {
    try {
      onVoiceToggle();
    } catch (error) {
      console.error('Error toggling voice:', error);
      toast({
        title: "Error de voz",
        description: "No se pudo activar el micrófono",
        variant: "destructive"
      });
    }
  };
  return;
};
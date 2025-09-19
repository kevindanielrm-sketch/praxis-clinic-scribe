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
  const { toast } = useToast();

  const handleSendText = async () => {
    if (!textInput.trim() || isLoading) return;

    try {
      setIsLoading(true);
      await onTextMessage(textInput.trim());
      setTextInput("");
      
      toast({
        title: "Mensaje enviado",
        description: "Procesando tu consulta...",
      });
    } catch (error) {
      console.error('Error sending text message:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje",
        variant: "destructive",
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
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-medical-border">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center space-x-4">
          {/* Voice Button */}
          <Button
            onClick={handleVoiceClick}
            disabled={disabled}
            variant={isVoiceActive ? "default" : "outline"}
            size="sm"
            className={`shrink-0 ${
              isVoiceActive 
                ? "bg-accent hover:bg-accent/90 text-white animate-pulse" 
                : "border-medical-border hover:bg-medical-hover"
            }`}
          >
            <span className="material-icons text-sm">
              {isVoiceActive ? "mic" : "mic_none"}
            </span>
          </Button>

          {/* Text Input */}
          <div className="flex-1 flex items-center space-x-2">
            <Input
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu consulta médica o pregunta..."
              disabled={disabled || isLoading}
              className="flex-1 border-medical-border focus:ring-accent"
            />
            
            <Button
              onClick={handleSendText}
              disabled={!textInput.trim() || isLoading || disabled}
              size="sm"
              className="shrink-0"
            >
              {isLoading ? (
                <span className="material-icons text-sm animate-spin">refresh</span>
              ) : (
                <span className="material-icons text-sm">send</span>
              )}
            </Button>
          </div>

          {/* Status Indicator */}
          <div className="shrink-0 flex items-center space-x-2">
            {isVoiceActive && (
              <div className="flex items-center space-x-1 text-xs text-accent">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <span>Escuchando...</span>
              </div>
            )}
            
            {isLoading && (
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                <span>Procesando...</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-3 flex items-center justify-center space-x-4">
          <button
            onClick={() => setTextInput("Ayúdame a transcribir una consulta médica")}
            disabled={disabled}
            className="text-xs text-muted-foreground hover:text-accent transition-colors"
          >
            Transcribir consulta
          </button>
          <button
            onClick={() => setTextInput("Estructura mis notas en formato SOAP")}
            disabled={disabled}
            className="text-xs text-muted-foreground hover:text-accent transition-colors"
          >
            Formato SOAP
          </button>
          <button
            onClick={() => setTextInput("Sugiere códigos CIE-10 para este caso")}
            disabled={disabled}
            className="text-xs text-muted-foreground hover:text-accent transition-colors"
          >
            Códigos CIE-10
          </button>
        </div>
      </div>
    </div>
  );
};
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface UserProfile {
  first_name: string | null;
  last_name: string | null;
  specialty: string | null;
  medical_license: string | null;
  institution: string | null;
  created_at: string;
}

interface UserStats {
  totalNotes: number;
  thisMonth: number;
  avgDuration: number;
}

export const UserProfileDialog = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats>({ totalNotes: 0, thisMonth: 0, avgDuration: 0 });
  const [userEmail, setUserEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      setUserEmail(user.email || "");

      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setProfile(profileData);

      // Load statistics
      const { data: notesData } = await supabase
        .from('clinical_notes')
        .select('created_at, audio_duration')
        .eq('user_id', user.id);

      if (notesData) {
        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const totalNotes = notesData.length;
        const thisMonthNotes = notesData.filter(note => 
          new Date(note.created_at) >= thisMonth
        ).length;
        
        const avgDuration = notesData.reduce((acc, note) => 
          acc + (note.audio_duration || 0), 0
        ) / (totalNotes || 1);

        setStats({
          totalNotes,
          thisMonth: thisMonthNotes,
          avgDuration: Math.round(avgDuration)
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const getDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `Dr. ${profile.first_name} ${profile.last_name}`;
    }
    if (profile?.first_name) {
      return `Dr. ${profile.first_name}`;
    }
    return "Dr. Usuario";
  };

  const getSpecialty = () => {
    return profile?.specialty || "Médico General";
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button 
          onClick={loadUserData}
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-medical-hover transition-colors"
        >
          <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
            <span className="material-icons text-sm text-accent">person</span>
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="text-sm font-medium truncate">{getDisplayName()}</div>
            <div className="text-xs text-muted-foreground">{getSpecialty()}</div>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <span className="material-icons mr-2 text-accent">person</span>
            Perfil de Usuario
          </DialogTitle>
          <DialogDescription>
            Información de tu cuenta y estadísticas de uso
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="text-center py-8">
            <div className="text-sm text-muted-foreground">Cargando...</div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* User Info Card */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                    <span className="material-icons text-accent">person</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{getDisplayName()}</h3>
                    <p className="text-sm text-muted-foreground">{userEmail}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {profile?.specialty && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Especialidad:</span>
                    <Badge variant="secondary">{profile.specialty}</Badge>
                  </div>
                )}
                
                {profile?.medical_license && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Licencia:</span>
                    <span className="text-sm font-mono">{profile.medical_license}</span>
                  </div>
                )}
                
                {profile?.institution && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Institución:</span>
                    <span className="text-sm">{profile.institution}</span>
                  </div>
                )}
                
                {profile?.created_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Miembro desde:</span>
                    <span className="text-sm">
                      {format(new Date(profile.created_at), "MMM yyyy", { locale: es })}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Statistics Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-accent">{stats.totalNotes}</div>
                    <div className="text-xs text-muted-foreground">Notas Totales</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent">{stats.thisMonth}</div>
                    <div className="text-xs text-muted-foreground">Este Mes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent">{stats.avgDuration}s</div>
                    <div className="text-xs text-muted-foreground">Duración Prom.</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* Actions */}
            <div className="flex flex-col space-y-2">
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="w-full justify-start text-destructive hover:text-destructive"
              >
                <span className="material-icons mr-2 text-sm">logout</span>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
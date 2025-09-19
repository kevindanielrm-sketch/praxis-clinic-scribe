import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  first_name: string | null;
  last_name: string | null;
  specialty: string | null;
  medical_license: string | null;
  institution: string | null;
}

export const SettingsSheet = () => {
  const [profile, setProfile] = useState<UserProfile>({
    first_name: "",
    last_name: "",
    specialty: "",
    medical_license: "",
    institution: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          specialty: data.specialty || "",
          medical_license: data.medical_license || "",
          institution: data.institution || "",
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el perfil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          specialty: profile.specialty,
          medical_license: profile.medical_license,
          institution: profile.institution,
        });

      if (error) throw error;

      toast({
        title: "Perfil actualizado",
        description: "Los cambios se han guardado correctamente",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el perfil",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="border-medical-border hover:bg-medical-hover">
          <span className="material-icons mr-2 text-sm">settings</span>
          Configuraciones
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <span className="material-icons mr-2 text-accent">settings</span>
            Configuraciones
          </SheetTitle>
          <SheetDescription>
            Administra tu perfil y preferencias de la aplicación
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="preferences">Preferencias</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información Personal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name">Nombre</Label>
                      <Input
                        id="first_name"
                        value={profile.first_name || ""}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                        placeholder="Tu nombre"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Apellidos</Label>
                      <Input
                        id="last_name"
                        value={profile.last_name || ""}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                        placeholder="Tus apellidos"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="specialty">Especialidad</Label>
                    <Input
                      id="specialty"
                      value={profile.specialty || ""}
                      onChange={(e) => handleInputChange('specialty', e.target.value)}
                      placeholder="Tu especialidad médica"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="medical_license">Licencia Médica</Label>
                    <Input
                      id="medical_license"
                      value={profile.medical_license || ""}
                      onChange={(e) => handleInputChange('medical_license', e.target.value)}
                      placeholder="Número de licencia médica"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="institution">Institución</Label>
                    <Input
                      id="institution"
                      value={profile.institution || ""}
                      onChange={(e) => handleInputChange('institution', e.target.value)}
                      placeholder="Hospital o clínica"
                      disabled={loading}
                    />
                  </div>

                  <Button 
                    onClick={saveProfile} 
                    disabled={saving || loading}
                    className="w-full"
                  >
                    {saving ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Preferencias de Aplicación</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Idioma de la interfaz</Label>
                    <Input value="Español" disabled />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label>Formato de notas por defecto</Label>
                    <Input value="SOAP" disabled />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label>Autosave de transcripciones</Label>
                    <Input value="Habilitado" disabled />
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Estas configuraciones estarán disponibles en futuras versiones.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};
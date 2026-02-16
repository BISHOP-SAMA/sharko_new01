import { useMutation } from "@tanstack/react-query";
import { insertRegistrationSchema, type InsertRegistration } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useCreateRegistration() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertRegistration) => {
      const validated = insertRegistrationSchema.parse(data);
      
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Something went wrong with your registration!");
      }

      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "WELCOME TO THE SHACKO FAM!",
        description: "Your wallet has been added to the whitelist.",
        className: "bg-[#38bdf8] text-white border-4 border-black font-[Bangers] text-xl",
      });
    },
    onError: (error) => {
      toast({
        title: "UH OH! CHOMPED!",
        description: error.message,
        variant: "destructive",
        className: "font-bold border-4 border-black",
      });
    },
  });
}

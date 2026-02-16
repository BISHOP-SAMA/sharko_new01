import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRegistrationSchema, type InsertRegistration } from "@shared/schema";
import { useCreateRegistration } from "@/hooks/use-registrations";
import { ComicButton } from "@/components/ui/comic-button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import formImage from "@assets/form-shark.png";

export function RegistrationForm() {
  const { mutate, isPending } = useCreateRegistration();

  const form = useForm<InsertRegistration>({
    resolver: zodResolver(insertRegistrationSchema),
    defaultValues: {
      walletAddress: "",
      xUsername: "",
      discordUsername: "",
    },
  });

  function onSubmit(data: InsertRegistration) {
    mutate(data, {
      onSuccess: () => form.reset(),
    });
  }

  return (
    <div className="w-full max-w-md mx-auto relative z-10">
      {/* Form Image */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center mb-6"
      >
        <img 
          src={formImage} 
          alt="Fill the form!" 
          className="w-64 h-auto object-contain drop-shadow-lg"
        />
      </motion.div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="bg-white border-4 border-black rounded-3xl p-8 comic-shadow shadow-black/20"
      >
        <div className="mb-6 text-center">
          <h2 className="text-4xl font-[Bangers] text-[#38bdf8] text-stroke uppercase mb-2">
            Get On The List!
          </h2>
          <p className="text-muted-foreground font-bold">
            Secure your spot in the Shacko ecosystem.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="walletAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-[Fredoka] font-bold text-slate-700">
                    Wallet Address <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Input
                        placeholder="0x..."
                        className="h-14 rounded-xl border-2 border-black bg-gray-50 text-lg font-mono focus:ring-4 focus:ring-[#38bdf8]/30 focus:border-[#38bdf8] transition-all"
                        data-testid="input-wallet-address"
                        {...field}
                      />
                      <div className="absolute inset-0 rounded-xl bg-[#38bdf8]/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
                    </div>
                  </FormControl>
                  <FormMessage className="font-bold text-red-500 ml-2" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="xUsername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-[Fredoka] font-bold text-slate-700">
                    X (Twitter) Username <span className="text-slate-400 font-normal">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Input
                        placeholder="@yourusername"
                        className="h-12 rounded-xl border-2 border-black/50 bg-gray-50 text-base focus:ring-4 focus:ring-[#38bdf8]/30 focus:border-[#38bdf8] transition-all"
                        data-testid="input-x-username"
                        {...field}
                        value={field.value || ""}
                      />
                      <div className="absolute inset-0 rounded-xl bg-[#38bdf8]/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
                    </div>
                  </FormControl>
                  <FormMessage className="font-bold text-red-500 ml-2" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discordUsername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-[Fredoka] font-bold text-slate-700">
                    Discord Username <span className="text-slate-400 font-normal">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Input
                        placeholder="username#1234"
                        className="h-12 rounded-xl border-2 border-black/50 bg-gray-50 text-base focus:ring-4 focus:ring-[#38bdf8]/30 focus:border-[#38bdf8] transition-all"
                        data-testid="input-discord-username"
                        {...field}
                        value={field.value || ""}
                      />
                      <div className="absolute inset-0 rounded-xl bg-[#38bdf8]/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
                    </div>
                  </FormControl>
                  <FormMessage className="font-bold text-red-500 ml-2" />
                </FormItem>
              )}
            />
            
            <ComicButton 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isPending}
              data-testid="button-submit-registration"
            >
              {isPending ? "Chomping..." : "Submit to Whitelist"}
            </ComicButton>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}

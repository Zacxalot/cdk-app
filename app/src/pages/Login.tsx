import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Auth from "aws-amplify/auth";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        console.log(await Auth.getCurrentUser());
        // User logged in, redirect to home
        navigate("/");
      } catch (error) {
        // User not logged in :)
      }
    };

    checkAuthState();
  }, [navigate]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { email, password } = values;
    console.log({ email, password });

    const user = await Auth.signIn({ username: email, password });

    // If the user hasn't changed their password, force them to do so
    if (
      user.nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
    ) {
      await Auth.confirmSignIn({ challengeResponse: password });
    }

    // Send user to home page
    navigate("/");
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Email' {...field} />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder='Password' {...field} />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <Button type='submit'>Login</Button>
        </form>
      </Form>
    </>
  );
}

export default Login;

"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client";
export const LoginCard = () => {
    const handleLogin = async () => {
        await authClient.signIn.social({
            provider: "github",
            callbackURL: "http://localhost:3000",
        }, {
            // onSuccess: () => {
            //     router.push("/");
            // }
        });
    }
    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-[350px]">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl">Welcome!</CardTitle>
                    <CardDescription className="text-2xl">Sign in to your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleLogin} variant={"outline"} className="w-full font-semibold">
                        Continue with Github
                    </Button>
                </CardContent>

            </Card>
        </div>
    )
}

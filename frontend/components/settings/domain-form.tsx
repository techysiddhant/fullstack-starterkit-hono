"use client"
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { useMutation, useQuery } from "@tanstack/react-query"
import { addCustomDomain, getDomainConfig } from "@/lib/domain"
import { DomainCard } from "./domain-card"
import { queryClient } from "@/lib/query-client"
import { useEffect, useState } from "react"
const formSchema = z.object({
    customDomain: z.string().min(2),
})

export const DomainForm = () => {
    const [domain, setDomain] = useState<string | null>(null);
    const { data: userData } = authClient.useSession();
    const { data, isLoading } = useQuery({
        queryKey: ["domains"],
        queryFn: async () => {
            const res = await fetch('http://localhost:8787/profile', {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "GET",
                credentials: "include",
            });
            // const domainData = await getDomainProject(userData?.user?.id!);
            const datares = await res.json();
            setDomain(datares[0]?.customDomain);
            const datab = await Promise.all(
                datares.map(async (value: any) => {
                    const config = await getDomainConfig(value.customDomain);
                    return {
                        ...value,
                        config,
                    };
                })
            );
            // console.log("DOMAIN DATA", domainData);
            // const config = domainData ? await getDomainConfig(domainData.split(":")[0]) : null;
            return {
                domains: datab,
                // customDomain: domainData?.split(":")[0],
            }
            // return data;
            // return await getDomainConfig(data?.user?.username!)
        }
    });
    console.log("FETCH", data?.domains);
    const { mutate } = useMutation({
        mutationFn: async (domain: string) => {
            await addCustomDomain(domain, { userId: userData?.user?.username! });
            await fetch('http://localhost:8787/settings', {
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ customDomain: domain, fullName: "" }),
                method: "POST",
                credentials: "include",
            });
            await queryClient.invalidateQueries({ queryKey: ["domains"] });

            // setDomain("");
        },
    });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            customDomain: domain ?? "",
        },
    })
    useEffect(() => {
        form.setValue('customDomain', domain ?? "")
    }, [domain, form])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        mutate(values.customDomain);
    }
    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="customDomain"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Custom Domain</FormLabel>
                                <FormControl>
                                    <Input placeholder="enter your domain" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your public domain name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
            <div className="my-10">
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    data?.domains.map((domain: any, ind) => (
                        <DomainCard key={ind} {...domain} />
                    ))
                    // data?.domains && <DomainCard customDomain={data?.customDomain!} config={data?.domains} />
                )}
            </div>
        </div>

    )
}

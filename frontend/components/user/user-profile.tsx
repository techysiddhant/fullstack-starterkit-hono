"use client";

import { useQuery } from "@tanstack/react-query";

export const UserProfile = ({ username }: { username: string }) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["domains"],
        queryFn: async () => {
            const res = await fetch(`http://localhost:8787/${username}`, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "GET",
                credentials: "include",
            });
            // const domainData = await getDomainProject(userData?.user?.id!);
            const datares = await res.json();
            return datares;
        }
    });
    if (isLoading) { return (<div className="text-2xl text-center">Loading ...</div>) }
    // console.log("user", data);
    if (isError) { return (<div className="text-2xl text-center">Error</div>) }
    return (
        <div>
            <h2>Username: {data[0].username}</h2>
            <h2>Email: {data[0].email}</h2>
        </div>
    )
}

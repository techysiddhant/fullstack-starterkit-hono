import React from 'react'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { ProfileForm } from '@/components/settings/profile-form'
import { DomainForm } from '@/components/settings/domain-form'
const SettingsPage = () => {
    return (
        <div className='flex items-center justify-center py-10'>
            <Tabs defaultValue="profile" className="w-full max-w-2xl">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="domain">Domain</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                    <ProfileForm />
                </TabsContent>
                <TabsContent value="domain">
                    <DomainForm />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default SettingsPage
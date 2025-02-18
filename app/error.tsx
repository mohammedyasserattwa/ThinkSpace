"use client"

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";


const Error = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center space-y-4 dark:bg-[#1f1f1f]">
            <Image 
            className="dark:hidden" 
            src="/error.svg" 
            width={300} 
            height={300} 
            alt="Error" />
            <Image 
            className="dark:block hidden" 
            src="/error-dark.svg" 
            width={300} 
            height={300} 
            alt="Error" />
            <h2 className="text-xl font-medium">
                Something went wrong!
            </h2>
            <Button asChild>
                <Link href="/documents">
                    Go back
                </Link>
            </Button>
        </div>
    )
}

export default Error
import Image from "next/image";

import { Poppins } from "next/font/google";
import {cn} from "@/lib/utils";

const font = Poppins({
    subsets: ["latin"],
    weight: ["400", "600"],
});

export const Logo = ({logoWidth = 100}) => {
    return (
        <div className="hidden md:flex items-center gap-x-2">
            <Image
                src="/logo.svg"
                alt="ThinkSpace"
                width={logoWidth}
                height={40}
                className = "dark:hidden"
            />
            <Image
                src="/logo_dark.png"
                alt="ThinkSpace"
                width={logoWidth}
                height={40}
                className = "hidden dark:block"
            />
        </div>
    )
}

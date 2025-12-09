// AUTOMATICALLY GENERATED
"use client";

import * as React from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import * as FramerMotion from "framer-motion";
import * as RechartsModule from "recharts";
import * as ZodModule from "zod";
import * as ReactHookForm from "react-hook-form";
import * as HookFormResolversZod from "@hookform/resolvers/zod";

// --- IMPORTS ---
import * as AccordionModule from "@/components/ui/accordion";
import * as AlertDialogModule from "@/components/ui/alert-dialog";
import * as AlertModule from "@/components/ui/alert";
import * as AspectRatioModule from "@/components/ui/aspect-ratio";
import * as AvatarModule from "@/components/ui/avatar";
import * as BadgeModule from "@/components/ui/badge";
import * as BreadcrumbModule from "@/components/ui/breadcrumb";
import * as ButtonGroupModule from "@/components/ui/button-group";
import * as ButtonModule from "@/components/ui/button";
import * as CalendarModule from "@/components/ui/calendar";
import * as CardModule from "@/components/ui/card";
import * as CarouselModule from "@/components/ui/carousel";
import * as ChartModule from "@/components/ui/chart";
import * as CheckboxModule from "@/components/ui/checkbox";
import * as CollapsibleModule from "@/components/ui/collapsible";
import * as CommandModule from "@/components/ui/command";
import * as ContextMenuModule from "@/components/ui/context-menu";
import * as DialogModule from "@/components/ui/dialog";
import * as DrawerModule from "@/components/ui/drawer";
import * as DropdownMenuModule from "@/components/ui/dropdown-menu";
import * as EmptyModule from "@/components/ui/empty";
import * as FieldModule from "@/components/ui/field";
import * as FormModule from "@/components/ui/form";
import * as HoverCardModule from "@/components/ui/hover-card";
import * as InputGroupModule from "@/components/ui/input-group";
import * as InputOtpModule from "@/components/ui/input-otp";
import * as InputModule from "@/components/ui/input";
import * as ItemModule from "@/components/ui/item";
import * as KbdModule from "@/components/ui/kbd";
import * as LabelModule from "@/components/ui/label";
import * as MenubarModule from "@/components/ui/menubar";
import * as NavigationMenuModule from "@/components/ui/navigation-menu";
import * as PaginationModule from "@/components/ui/pagination";
import * as PopoverModule from "@/components/ui/popover";
import * as ProgressModule from "@/components/ui/progress";
import * as RadioGroupModule from "@/components/ui/radio-group";
import * as ResizableModule from "@/components/ui/resizable";
import * as ScrollAreaModule from "@/components/ui/scroll-area";
import * as SelectModule from "@/components/ui/select";
import * as SeparatorModule from "@/components/ui/separator";
import * as SheetModule from "@/components/ui/sheet";
import * as SidebarModule from "@/components/ui/sidebar";
import * as SkeletonModule from "@/components/ui/skeleton";
import * as SliderModule from "@/components/ui/slider";
import * as SonnerModule from "@/components/ui/sonner";
import * as SpinnerModule from "@/components/ui/spinner";
import * as SwitchModule from "@/components/ui/switch";
import * as TableModule from "@/components/ui/table";
import * as TabsModule from "@/components/ui/tabs";
import * as TextareaModule from "@/components/ui/textarea";
import * as ToastModule from "@/components/ui/toast";
import * as ToasterModule from "@/components/ui/toaster";
import * as ToggleGroupModule from "@/components/ui/toggle-group";
import * as ToggleModule from "@/components/ui/toggle";
import * as TooltipModule from "@/components/ui/tooltip";

export const UI_REGISTRY = {
    cn,
    React,
    FramerMotion,
    Recharts: RechartsModule,
    Zod: ZodModule,
    ReactHookForm: ReactHookForm,
    HookFormResolversZod: HookFormResolversZod,
    // ВАЖЛИВО: Додаємо весь об'єкт іконок для компілятора
    LucideIcons,

    // --- UI COMPONENTS (High Priority) ---
    ...AccordionModule,
    ...AlertDialogModule,
    ...AlertModule,
    ...AspectRatioModule,
    ...AvatarModule,
    ...BadgeModule,
    ...BreadcrumbModule,
    ...ButtonGroupModule,
    ...ButtonModule,
    ...CalendarModule,
    ...CardModule,
    ...CarouselModule,
    ...ChartModule,
    ...CheckboxModule,
    ...CollapsibleModule,
    ...CommandModule,
    ...ContextMenuModule,
    ...DialogModule,
    ...DrawerModule,
    ...DropdownMenuModule,
    ...EmptyModule,
    ...FieldModule,
    ...FormModule,
    ...HoverCardModule,
    ...InputGroupModule,
    ...InputOtpModule,
    ...InputModule,
    ...ItemModule,
    ...KbdModule,
    ...LabelModule,
    ...MenubarModule,
    ...NavigationMenuModule,
    ...PaginationModule,
    ...PopoverModule,
    ...ProgressModule,
    ...RadioGroupModule,
    ...ResizableModule,
    ...ScrollAreaModule,
    ...SelectModule,
    ...SeparatorModule,
    ...SheetModule,
    ...SidebarModule,
    ...SkeletonModule,
    ...SliderModule,
    ...SonnerModule,
    ...SpinnerModule,
    ...SwitchModule,
    ...TableModule,
    ...TabsModule,
    ...TextareaModule,
    ...ToastModule,
    ...ToasterModule,
    ...ToggleGroupModule,
    ...ToggleModule,
    ...TooltipModule,

    // --- MANUAL OVERRIDES ---

    Image: (props: any) => {
        const {
            src,
            alt,
            fill,
            width,
            height,
            style,
            className,
            onClick,
            priority,
            onLoadingComplete,
            onLoad,
            ...rest
        } = props;
        let styles = { ...style };
        if (fill) {
            styles = {
                ...styles,
                position: "absolute",
                height: "100%",
                width: "100%",
                inset: 0,
                objectFit: "cover",
                color: "transparent",
            };
        }
        const handleLoad = (e: any) => {
            if (onLoad) onLoad(e);
            if (onLoadingComplete) {
                const img = e.target;
                onLoadingComplete({
                    naturalWidth: img.naturalWidth,
                    naturalHeight: img.naturalHeight,
                });
            }
        };
        return (
            <img
                src={src}
                alt={alt || ""}
                className={cn(className)}
                style={styles}
                width={fill ? undefined : width}
                height={fill ? undefined : height}
                loading={priority ? "eager" : "lazy"}
                decoding="async"
                onClick={onClick}
                onLoad={handleLoad}
                {...rest}
            />
        );
    },

    Link: (props: any) => {
        const { href, children, ...rest } = props;
        return (
            <a href={href} {...rest}>
                {children}
            </a>
        );
    },
};

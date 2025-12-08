// AUTOMATICALLY GENERATED
import * as React from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import * as FramerMotion from "framer-motion";
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
    LucideIcons,
    FramerMotion,
    // 1. Спочатку іконки (найнижчий пріоритет)
    ...Object.keys(LucideIcons).reduce((acc, key) => {
        // @ts-ignore
        acc[key] = LucideIcons[key];
        return acc;
    }, {} as any),
    ...AccordionModule,
    Accordion: AccordionModule || AccordionModule.Accordion,
    ...AlertDialogModule,
    AlertDialog: AlertDialogModule.default || AlertDialogModule.AlertDialog,
    ...AlertModule,
    Alert: AlertModule.default || AlertModule.Alert,
    ...AspectRatioModule,
    AspectRatio: AspectRatioModule.default || AspectRatioModule.AspectRatio,
    ...AvatarModule,
    Avatar: AvatarModule.default || AvatarModule.Avatar,
    ...BadgeModule,
    Badge: BadgeModule.default || BadgeModule.Badge,
    ...BreadcrumbModule,
    Breadcrumb: BreadcrumbModule.default || BreadcrumbModule.Breadcrumb,
    ...ButtonGroupModule,
    ButtonGroup: ButtonGroupModule.default || ButtonGroupModule.ButtonGroup,
    ...ButtonModule,
    Button: ButtonModule.default || ButtonModule.Button,
    ...CalendarModule,
    Calendar: CalendarModule.default || CalendarModule.Calendar,
    ...CardModule,
    Card: CardModule.default || CardModule.Card,
    ...CarouselModule,
    Carousel: CarouselModule.default || CarouselModule.Carousel,
    ...ChartModule,
    Chart: ChartModule.default || ChartModule.Chart,
    ...CheckboxModule,
    Checkbox: CheckboxModule.default || CheckboxModule.Checkbox,
    ...CollapsibleModule,
    Collapsible: CollapsibleModule.default || CollapsibleModule.Collapsible,
    ...CommandModule,
    Command: CommandModule.default || CommandModule.Command,
    ...ContextMenuModule,
    ContextMenu: ContextMenuModule.default || ContextMenuModule.ContextMenu,
    ...DialogModule,
    Dialog: DialogModule.default || DialogModule.Dialog,
    ...DrawerModule,
    Drawer: DrawerModule.default || DrawerModule.Drawer,
    ...DropdownMenuModule,
    DropdownMenu: DropdownMenuModule.default || DropdownMenuModule.DropdownMenu,
    ...EmptyModule,
    Empty: EmptyModule.default || EmptyModule.Empty,
    ...FieldModule,
    Field: FieldModule.default || FieldModule.Field,
    ...FormModule,
    Form: FormModule.default || FormModule.Form,
    ...HoverCardModule,
    HoverCard: HoverCardModule.default || HoverCardModule.HoverCard,
    ...InputGroupModule,
    InputGroup: InputGroupModule.default || InputGroupModule.InputGroup,
    ...InputOtpModule,
    InputOtp: InputOtpModule.default || InputOtpModule.InputOtp,
    ...InputModule,
    Input: InputModule.default || InputModule.Input,
    ...ItemModule,
    Item: ItemModule.default || ItemModule.Item,
    ...KbdModule,
    Kbd: KbdModule.default || KbdModule.Kbd,
    ...LabelModule,
    Label: LabelModule.default || LabelModule.Label,
    ...MenubarModule,
    Menubar: MenubarModule.default || MenubarModule.Menubar,
    ...NavigationMenuModule,
    NavigationMenu: NavigationMenuModule.default || NavigationMenuModule.NavigationMenu,
    ...PaginationModule,
    Pagination: PaginationModule.default || PaginationModule.Pagination,
    ...PopoverModule,
    Popover: PopoverModule.default || PopoverModule.Popover,
    ...ProgressModule,
    Progress: ProgressModule.default || ProgressModule.Progress,
    ...RadioGroupModule,
    RadioGroup: RadioGroupModule.default || RadioGroupModule.RadioGroup,
    ...ResizableModule,
    Resizable: ResizableModule.default || ResizableModule.Resizable,
    ...ScrollAreaModule,
    ScrollArea: ScrollAreaModule.default || ScrollAreaModule.ScrollArea,
    ...SelectModule,
    Select: SelectModule.default || SelectModule.Select,
    ...SeparatorModule,
    Separator: SeparatorModule.default || SeparatorModule.Separator,
    ...SheetModule,
    Sheet: SheetModule.default || SheetModule.Sheet,
    ...SidebarModule,
    Sidebar: SidebarModule.default || SidebarModule.Sidebar,
    ...SkeletonModule,
    Skeleton: SkeletonModule.default || SkeletonModule.Skeleton,
    ...SliderModule,
    Slider: SliderModule.default || SliderModule.Slider,
    ...SonnerModule,
    Sonner: SonnerModule.default || SonnerModule.Sonner,
    ...SpinnerModule,
    Spinner: SpinnerModule.default || SpinnerModule.Spinner,
    ...SwitchModule,
    Switch: SwitchModule.default || SwitchModule.Switch,
    ...TableModule,
    Table: TableModule.default || TableModule.Table,
    ...TabsModule,
    Tabs: TabsModule.default || TabsModule.Tabs,
    ...TextareaModule,
    Textarea: TextareaModule.default || TextareaModule.Textarea,
    ...ToastModule,
    Toast: ToastModule.default || ToastModule.Toast,
    ...ToasterModule,
    Toaster: ToasterModule.default || ToasterModule.Toaster,
    ...ToggleGroupModule,
    ToggleGroup: ToggleGroupModule.default || ToggleGroupModule.ToggleGroup,
    ...ToggleModule,
    Toggle: ToggleModule.default || ToggleModule.Toggle,
    ...TooltipModule,
    Tooltip: TooltipModule.default || TooltipModule.Tooltip,

   // Next.js Image Override
    Image: (props: any) => {
        // 1. Деструктуризуємо onLoadingComplete, щоб він не потрапив у ...rest
        const { src, alt, fill, width, height, style, className, onClick, priority, loading, onLoadingComplete, onLoad, ...rest } = props;
        
        let styles = { ...style };
        if (fill) {
            styles = { ...styles, position: 'absolute', height: '100%', width: '100%', inset: 0, objectFit: 'cover', color: 'transparent' };
        }

        // 2. Створюємо обробник для native onLoad
        const handleLoad = (e: any) => {
            // Якщо передали звичайний onLoad
            if (onLoad) onLoad(e);

            // Якщо передали Next.js onLoadingComplete
            if (onLoadingComplete) {
                const img = e.target;
                // Next.js повертає об'єкт з розмірами
                onLoadingComplete({
                    naturalWidth: img.naturalWidth,
                    naturalHeight: img.naturalHeight
                });
            }
        };

        // ТУТ БУЛА ПОМИЛКА: iframeReact не існує. Використовуємо звичайний JSX.
        return <img 
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
        />;
    },


// Next.js Link Override
    Link: (props: any) => {
        const { href, children, ...rest } = props;
        // Ми просто рендеримо <a>.
        // Глобальний скрипт в PreviewFrame перехопить клік і зробить скрол,
        // якщо href починається з #.
        return <a href={href} {...rest}>{children}</a>;
    },
};

// AUTOMATICALLY GENERATED
'use client'

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
import *as ProgressModule from "@/components/ui/progress";
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

// --- UI REGISTRY ---
export const UI_REGISTRY = {
  cn,
  React,
  LucideIcons,
  FramerMotion,

  // --- UI Components and Next.js Overrides (MUST be defined first for priority) ---
  
  // Next.js Image Override (Priority over LucideIcons.Image)
  Image: (props: any) => {
    const { src, alt, fill, width, height, style, className, onClick, priority, onLoadingComplete, onLoad, ...rest } = props;
    let styles = { ...style };
    if (fill) {
      styles = { ...styles, position: 'absolute', height: '100%', width: '100%', inset: 0, objectFit: 'cover', color: 'transparent' };
    }
    const handleLoad = (e: any) => {
      if (onLoad) onLoad(e);
      if (onLoadingComplete) {
        const img = e.target;
        onLoadingComplete({ naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight });
      }
    };
    return <img src={src} alt={alt || ""} className={cn(className)} style={styles} width={fill ? undefined : width} height={fill ? undefined : height} loading={priority ? "eager" : "lazy"} decoding="async" onClick={onClick} onLoad={handleLoad} {...rest} />;
  },

  // Next.js Link Override (Priority over potential LucideIcons.Link)
  Link: (props: any) => {
    const { href, children, ...rest } = props;
    return <a href={href} {...rest}>{children}</a>;
  },

  // Shadcn/UI Components (Priority over Lucide icons with the same name)
  Accordion: AccordionModule.Accordion,
  AccordionItem: AccordionModule.AccordionItem,
  AccordionTrigger: AccordionModule.AccordionTrigger,
  AccordionContent: AccordionModule.AccordionContent,

  AlertDialog: AlertDialogModule.AlertDialog,
  AlertDialogTrigger: AlertDialogModule.AlertDialogTrigger,
  AlertDialogContent: AlertDialogModule.AlertDialogContent,
  AlertDialogHeader: AlertDialogModule.AlertDialogHeader,
  AlertDialogFooter: AlertDialogModule.AlertDialogFooter,
  AlertDialogTitle: AlertDialogModule.AlertDialogTitle,
  AlertDialogDescription: AlertDialogModule.AlertDialogDescription,
  AlertDialogAction: AlertDialogModule.AlertDialogAction,
  AlertDialogCancel: AlertDialogModule.AlertDialogCancel,

  Alert: AlertModule.Alert, // Conflicts with LucideIcons.Alert
  AlertTitle: AlertModule.AlertTitle,
  AlertDescription: AlertModule.AlertDescription,

  AspectRatio: AspectRatioModule.AspectRatio,
  Avatar: AvatarModule.Avatar, // Conflicts with LucideIcons.Avatar
  Badge: BadgeModule.Badge,
  Breadcrumb: BreadcrumbModule.Breadcrumb,
  ButtonGroup: ButtonGroupModule.ButtonGroup,
  Button: ButtonModule.Button, // Conflicts with LucideIcons.Button
  Calendar: CalendarModule.Calendar, // Conflicts with LucideIcons.Calendar
  Card: CardModule.Card, // Conflicts with LucideIcons.Card
  Carousel: CarouselModule.Carousel,
  Chart: ChartModule.ChartStyle,
  Checkbox: CheckboxModule.Checkbox, // Conflicts with LucideIcons.Checkbox
  Collapsible: CollapsibleModule.Collapsible,
  Command: CommandModule.Command,
  ContextMenu: ContextMenuModule.ContextMenu,
  Dialog: DialogModule.Dialog,
  Drawer: DrawerModule.Drawer,
  DropdownMenu: DropdownMenuModule.DropdownMenu,
  Empty: EmptyModule.Empty,
  Field: FieldModule.Field,
  Form: FormModule.Form,
  HoverCard: HoverCardModule.HoverCard,
  InputGroup: InputGroupModule.InputGroup,
  InputOtp: InputOtpModule.InputOTP,
  Input: InputModule.Input,
  Item: ItemModule.Item,
  Kbd: KbdModule.Kbd,
  Label: LabelModule.Label, // Conflicts with LucideIcons.Label
  Menubar: MenubarModule.Menubar,
  NavigationMenu: NavigationMenuModule.NavigationMenu,
  Pagination: PaginationModule.Pagination,
  Popover: PopoverModule.Popover,
  Progress: ProgressModule.Progress, // Conflicts with LucideIcons.Progress
  RadioGroup: RadioGroupModule.RadioGroup,
  Resizable: ResizableModule.ResizablePanel,
  ScrollArea: ScrollAreaModule.ScrollArea,
  Select: SelectModule.Select, // Conflicts with LucideIcons.Select
  Separator: SeparatorModule.Separator,
  Sheet: SheetModule.Sheet,
  Sidebar: SidebarModule.Sidebar,
  Skeleton: SkeletonModule.Skeleton,
  Slider: SliderModule.Slider, // Conflicts with LucideIcons.Slider
  Sonner: SonnerModule.Toaster,
  Spinner: SpinnerModule.Spinner,
  Switch: SwitchModule.Switch,
  Table: TableModule.Table,
  Tabs: TabsModule.Tabs,
  Textarea: TextareaModule.Textarea,
  Toast: ToastModule.Toast,
  Toaster: ToasterModule.Toaster,
  ToggleGroup: ToggleGroupModule.ToggleGroup,
  Toggle: ToggleModule.Toggle,
  Tooltip: TooltipModule.Tooltip,
  
  // --- Lucide Icons (Added second to respect UI component priority) ---
  // Note: By using the spread operator AFTER the UI components,
  // we ensure that the UI components (e.g., Alert, Button, Image)
  // are the ones that end up in the registry.
  ...Object.keys(LucideIcons).reduce((acc, key) => {
    // @ts-ignore
    acc[key] = LucideIcons[key];
    return acc;
  }, {} as any),
};

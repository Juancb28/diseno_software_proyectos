/**
 * Componentes UI adaptados al esquema MUI (paleta primary #1565c0, secondary #0d47a1).
 * Equivalentes a los de shadcn/Radix pero con Material-UI.
 */

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./Accordion";
export { Alert, AlertTitle, AlertDescription } from "./Alert";
export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "./AlertDialog";
export { Avatar, AvatarImage, AvatarFallback } from "./Avatar";
export { Badge } from "./Badge";
export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "./Breadcrumb";
export { Button } from "./Button";
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "./Card";
export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./Dialog";
export {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from "./Drawer";
export { Input } from "./Input";
export { Label } from "./Label";
export { Progress } from "./Progress";
export { RadioGroup, RadioGroupItem } from "./RadioGroup";

// Nuevos componentes con Tailwind CSS y Radix UI
export { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "./Resizable";
export { ScrollArea, ScrollBar } from "./ScrollArea";
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "./Select";
export { Separator } from "./Separator";
export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
} from "./Sheet";
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "./Sidebar";
export { Skeleton } from "./Skeleton";
export { Slider } from "./Slider";
export { Toaster as SonnerToaster, toast as sonnerToast } from "./Sonner";
export { Switch } from "./Switch";
export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from "./Table";
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./Tabs";
export { Textarea } from "./Textarea";
export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
} from "./Toast";
export { Toaster as ToastToaster } from "./Toaster";
export { Toggle, toggleVariants } from "./Toggle";
export { ToggleGroup, ToggleGroupItem } from "./ToggleGroup";
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./Tooltip";
export { NavLink } from "./NavLink";

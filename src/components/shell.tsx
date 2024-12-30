import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const shellVariants = cva("grid items-center gap-8 pb-8 pt-6 md:py-8", {
  variants: {
    variant: {
      default: "container",
      sidebar: "",
      centered: "container flex h-[100dvh] max-w-2xl flex-col justify-center",
      markdown: "container max-w-3xl gap-0 py-8 md:py-10 lg:py-10",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

interface ShellProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof shellVariants> {
  as?: React.ElementType
}

function Shell({
  className,
  as: Comp = "div",
  variant,
  ...props
}: ShellProps) {
  return (
    <Comp className={cn(shellVariants({ variant }), className)} {...props} />
  )
}

const Header = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col gap-1", className)} {...props} />
))
Header.displayName = "Header"

const Title = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn(
      "text-2xl font-bold tracking-tight",
      className
    )}
    {...props}
  />
))
Title.displayName = "Title"

const Description = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-muted-foreground", className)}
    {...props}
  />
))
Description.displayName = "Description"

const Content = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col gap-4", className)} {...props} />
))
Content.displayName = "Content"

Shell.Header = Header
Shell.Title = Title
Shell.Description = Description
Shell.Content = Content

export { Shell }

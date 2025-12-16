"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import Link from "next/link";

/* -------------------- FormProps Interface -------------------- */
/**
 * IMPROVEMENT: Added button positioning and visibility controls
 * - submitButtonPosition: Control button alignment (left/center/right/full)
 * - showSubmitButton: Hide built-in button to use custom buttons
 * WHY: Provides flexibility for different form layouts and custom button implementations
 */
interface FormProps {
  fields: FieldConfig[];
  classNames?: string;
  submitButtonText?: string;
  submitButtonStyle?: string;
  submitButtonPosition?: "left" | "center" | "right" | "full";
  showSubmitButton?: boolean;
  formType?: string;
  submitFunction?: (data: Record<string, string>) => void;
}


/* -------------------- Schema -------------------- */

const generateSchema = (fields: FieldConfig[]) => {
  const shape = fields.reduce((acc, field) => {
    acc[field.name] = z
      .string()
      .min(2, `${field.label} must be at least 2 characters.`);
    return acc;
  }, {} as Record<string, z.ZodString>);

  return z.object(shape);
};

/* -------------------- Types -------------------- */

type IconPosition = "start" | "end" | "inline-start" | "inline-end";

interface DropdownConfig {
  options: string[];
  defaultValue?: string;
  onSelect?: (value: string) => void;
}

interface IconConfig {
  icon: React.ReactNode;
  position: IconPosition;
  type?: "icon" | "text" | "button";
  onClick?: () => void;
  tooltip?: string;
}

/**
 * IMPROVEMENT: Added textarea support with character counting
 * - rows: Control textarea height (number of visible lines)
 * - maxLength: Character limit with visual counter
 * WHY: Enables multi-line input fields for descriptions, comments, etc.
 */
interface FieldConfig {
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  type?: string;
  icons?: IconConfig[];
  dropdown?: DropdownConfig;

  /** layout */
  row?: string;        // same value = same row
  colSpan?: number;    // grid span (1–12)
  rows?: number;       // for textarea height
  maxLength?: number;  // character limit for textarea
}

interface FormProps {
  fields: FieldConfig[];
  classNames?: string;
  submitButtonText?: string;
  submitButtonStyle?: string;
  formType?: string;
  submitFunction?: (data: Record<string, string>) => void;
}

/* -------------------- Component -------------------- */

export default function FormComponent({
  fields,
  classNames = "",
  submitButtonStyle = "",
  submitButtonText = "Submit",
  submitButtonPosition = "left",
  showSubmitButton = true,
  formType = "",
  submitFunction = () => {},
}: FormProps) {
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>(
    Object.fromEntries(fields.map((f) => [f.name, false]))
  );

  const togglePasswordVisibility = (fieldName: string) => {
    setShowPassword((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const formSchema = generateSchema(fields);

  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: fields.reduce((acc, field) => {
      acc[field.name] = field.dropdown?.defaultValue ?? "";
      return acc;
    }, {} as Record<string, string>),
  });

  const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
    submitFunction?.(data);
  };

  /* -------- Group fields into rows -------- */

  const groupedFields = fields.reduce<Record<string, FieldConfig[]>>(
    (acc, field) => {
      const key = field.row ?? field.name;
      acc[key] = acc[key] || [];
      acc[key].push(field);
      return acc;
    },
    {}
  );

  /**
   * IMPROVEMENT: Button position control helper
   * Maps position prop to Tailwind flex classes for button alignment
   * WHY: Provides consistent button positioning across different form layouts
   */
  const getButtonPositionClass = () => {
    switch (submitButtonPosition) {
      case "left":
        return "flex justify-start";
      case "center":
        return "flex justify-center";
      case "right":
        return "flex justify-end";
      case "full":
        return "flex";
      default:
        return "flex justify-start";
    }
  };

  /**
   * IMPROVEMENT: Auto-calculate column spans for responsive layouts
   * - Uses complete Tailwind class names to fix JIT compilation
   * - Automatically distributes fields evenly across row width
   * - Supports explicit colSpan override when needed
   * WHY: Ensures fields fill container width properly and are responsive
   */
  const getColSpanClass = (field: FieldConfig, groupLength: number) => {
    if (field.colSpan) {
      // Use explicit colSpan if provided (must be full class name)
      const spanClasses: Record<number, string> = {
        1: "md:col-span-1",
        2: "md:col-span-2",
        3: "md:col-span-3",
        4: "md:col-span-4",
        5: "md:col-span-5",
        6: "md:col-span-6",
        7: "md:col-span-7",
        8: "md:col-span-8",
        9: "md:col-span-9",
        10: "md:col-span-10",
        11: "md:col-span-11",
        12: "md:col-span-12",
      };
      return spanClasses[field.colSpan] || "md:col-span-4";
    }
    
    // Auto-calculate based on number of fields in the row
    if (groupLength === 1) return "md:col-span-12";
    if (groupLength === 2) return "md:col-span-6";
    if (groupLength === 3) return "md:col-span-4";
    if (groupLength === 4) return "md:col-span-3";
    return "md:col-span-4"; // default fallback
  };

  const renderIconAddon = (iconConfig: IconConfig, fieldName: string) => {
    const align =
      iconConfig.position === "inline-start" ||
      iconConfig.position === "inline-end"
        ? iconConfig.position
        : undefined;

    if (iconConfig.type === "button") {
      return (
        <InputGroupAddon
          align={align}
          key={`${fieldName}-${iconConfig.position}`}
        >
          <InputGroupButton
            type="button"
            onClick={iconConfig.onClick}
            size="icon-xs"
            className="rounded-full"
          >
            {iconConfig.icon}
          </InputGroupButton>
        </InputGroupAddon>
      );
    }

    if (iconConfig.type === "text") {
      return (
        <InputGroupAddon
          align={align}
          key={`${fieldName}-${iconConfig.position}`}
        >
          <InputGroupText>{iconConfig.icon}</InputGroupText>
        </InputGroupAddon>
      );
    }

    return (
      <InputGroupAddon
        align={align}
        key={`${fieldName}-${iconConfig.position}`}
      >
        {iconConfig.icon}
      </InputGroupAddon>
    );
  };

  return (
    <Form {...formMethods}>
      <div className={`space-y-6 ${classNames}`}>
        {Object.values(groupedFields).map((group, idx) => (
          <div
            key={idx}
            className={
              group.length > 1
                ? "grid grid-cols-1 md:grid-cols-12 gap-4"
                : "space-y-6"
            }
          >
            {group.map((field) => (
              <FormField
                key={field.name}
                control={formMethods.control}
                name={field.name}
                render={({ field: formField }) => {
                  const startIcons = field.icons?.filter(
                    (i) =>
                      i.position === "start" || i.position === "inline-start"
                  );
                  const endIcons = field.icons?.filter(
                    (i) => i.position === "end" || i.position === "inline-end"
                  );

                  return (
                    <FormItem className={getColSpanClass(field, group.length)}>
                      <FormLabel>{field.label}</FormLabel>

                      <FormControl>
                        {/* IMPROVEMENT: Textarea support with character counter
                            - Renders textarea for multi-line input
                            - Shows character count in bottom-right corner
                            - Supports customizable rows and maxLength
                            WHY: Provides better UX for long-form text input */}
                        {field.type === "textarea" ? (
                          <div className="relative">
                            <textarea
                              {...formField}
                              placeholder={field.placeholder}
                              rows={field.rows || 6}
                              maxLength={field.maxLength}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 resize-none"
                            />
                            {field.maxLength && (
                              <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                                {formField.value?.length || 0}/{field.maxLength}
                              </div>
                            )}
                          </div>
                        ) : (
                          <InputGroup>
                            {startIcons?.map((icon) =>
                              renderIconAddon(icon, field.name)
                            )}

                            {/* IMPROVEMENT: Increased input height to h-11 (44px)
                                WHY: Larger touch targets improve accessibility and mobile UX */}
                            <InputGroupInput
                              {...formField}
                              placeholder={field.placeholder}
                              type={
                                field.type === "password"
                                  ? showPassword[field.name]
                                    ? "text"
                                    : "password"
                                  : field.type || "text"
                              }
                              className="h-11"
                            />

                            {field.type === "password" && (
                              <InputGroupAddon align="inline-end">
                                <InputGroupButton
                                  type="button"
                                  variant="ghost"
                                  size="icon-xs"
                                  className="h-9 w-9"
                                  onClick={() =>
                                    togglePasswordVisibility(field.name)
                                  }
                                >
                                  {showPassword[field.name] ? (
                                    <EyeOff className="h-5 w-5 text-gray-400" />
                                  ) : (
                                    <Eye className="h-5 w-5 text-gray-400" />
                                  )}
                                </InputGroupButton>
                              </InputGroupAddon>
                            )}

                            {endIcons?.map((icon) =>
                              renderIconAddon(icon, field.name)
                            )}

                            {field.dropdown && (
                              <InputGroupAddon>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <InputGroupButton variant="ghost">
                                      {formField.value ||
                                        field.dropdown.defaultValue}
                                    </InputGroupButton>
                                  </DropdownMenuTrigger>

                                  <DropdownMenuContent
                                    side="bottom"
                                    align="start"
                                  >
                                    {field.dropdown.options.map((option) => (
                                      <DropdownMenuItem
                                        key={option}
                                        onClick={() => {
                                          formField.onChange(option);
                                          field.dropdown?.onSelect?.(option);
                                        }}
                                      >
                                        {option}
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </InputGroupAddon>
                            )}
                          </InputGroup>
                        )}
                      </FormControl>

                      {field.description && (
                        <FormDescription>
                          {field.description}
                        </FormDescription>
                      )}

                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
        ))}

        {formType === "login" && (
          <div className="flex items-center justify-between -mt-3">
            <label className="flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500 focus:ring-2"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">
                Remember me
              </span>
            </label>

            <Link
              href="/forgot-password"
              className="text-sm font-medium text-cyan-600 hover:text-cyan-700"
            >
              Forgot Password?
            </Link>
          </div>
        )}

        {/* IMPROVEMENT: Conditional button rendering with flexible positioning
            - showSubmitButton: Hide button to use custom implementations
            - submitButtonPosition: Control alignment (left/center/right/full)
            - Auto full-width when position is "full"
            WHY: Allows for custom button layouts and different form designs */}
        {showSubmitButton && (
          <div className={getButtonPositionClass()}>
            <Button
              onClick={formMethods.handleSubmit(handleFormSubmit)}
              className={`${submitButtonPosition === "full" ? "w-full" : ""} ${submitButtonStyle}`}
            >
              {submitButtonText}
            </Button>
          </div>
        )}
      </div>
    </Form>
  );
}
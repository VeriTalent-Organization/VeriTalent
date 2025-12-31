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
import { FieldConfig, FormProps } from "@/types/dashboard";

/* -------------------- Updated FormProps with isSubmitting -------------------- */
interface EnhancedFormProps extends FormProps {
  isSubmitting?: boolean;
}

export default function FormComponent({
  fields,
  classNames = "",
  submitButtonStyle = "",
  submitButtonText = "Submit",
  submitButtonPosition = "left",
  showSubmitButton = true,
  formType = "",
  submitFunction = () => {},
  isSubmitting = false, // ← New prop: controls loading state
}: EnhancedFormProps) {
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>(
    Object.fromEntries(fields.map((f) => [f.name, false]))
  );

  const togglePasswordVisibility = (fieldName: string) => {
    setShowPassword((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  // Generate Zod schema dynamically
  const generateSchema = (fields: FieldConfig[]) => {
    const schema: Record<string, z.ZodString> = {};

    fields.forEach((field) => {
      let fieldSchema = z.string();

      switch (field.type) {
        case "email":
          fieldSchema = z.string().email("Please enter a valid email address");
          break;
        case "password":
          fieldSchema = z.string().min(8, "Password must be at least 8 characters");
          break;
        case "number":
          fieldSchema = z.string().regex(/^\d+$/, "Please enter a valid number");
          break;
        case "tel":
          fieldSchema = z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number");
          break;
        case "url":
          fieldSchema = z.string().url("Please enter a valid URL");
          break;
        default:
          fieldSchema = z.string();
      }

      // All fields are required except password (which has its own min length)
      if (field.type !== "password") {
        fieldSchema = fieldSchema.min(1, `${field.label} is required`);
      }

      if (field.maxLength) {
        fieldSchema = fieldSchema.max(field.maxLength, `Maximum ${field.maxLength} characters allowed`);
      }

      schema[field.name] = fieldSchema;
    });

    return z.object(schema);
  };

  const formSchema = generateSchema(fields);
  type FormData = z.infer<typeof formSchema>;

  const formMethods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: fields.reduce((acc, field) => {
      // Use empty string for dropdowns, not the placeholder text
      acc[field.name] = "";
      return acc;
    }, {} as Record<string, string>),
  });

  const handleFormSubmit = (data: FormData) => {
    submitFunction(data);
  };

  // Group fields by row
  const groupedFields = fields.reduce<Record<string, FieldConfig[]>>((acc, field) => {
    const key = field.row ?? field.name;
    acc[key] = acc[key] || [];
    acc[key].push(field);
    return acc;
  }, {});

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

  const getColSpanClass = (field: FieldConfig, groupLength: number) => {
    if (field.colSpan) {
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

    if (groupLength === 1) return "md:col-span-12";
    if (groupLength === 2) return "md:col-span-6";
    if (groupLength === 3) return "md:col-span-4";
    if (groupLength === 4) return "md:col-span-3";
    return "md:col-span-4";
  };

  const renderIconAddon = (iconConfig: any, fieldName: string) => {
    const align =
      iconConfig.position === "inline-start" || iconConfig.position === "inline-end"
        ? iconConfig.position
        : undefined;

    if (iconConfig.type === "button") {
      return (
        <InputGroupAddon align={align} key={`${fieldName}-${iconConfig.position}`}>
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
        <InputGroupAddon align={align} key={`${fieldName}-${iconConfig.position}`}>
          <InputGroupText>{iconConfig.icon}</InputGroupText>
        </InputGroupAddon>
      );
    }

    return (
      <InputGroupAddon align={align} key={`${fieldName}-${iconConfig.position}`}>
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
            className={group.length > 1 ? "grid grid-cols-1 md:grid-cols-12 gap-4" : "space-y-6"}
          >
            {group.map((field) => (
              <FormField
                key={field.name}
                control={formMethods.control}
                name={field.name}
                render={({ field: formField }) => {
                  const startIcons = field.icons?.filter(
                    (i) => i.position === "start" || i.position === "inline-start"
                  );
                  const endIcons = field.icons?.filter(
                    (i) => i.position === "end" || i.position === "inline-end"
                  );

                  return (
                    <FormItem className={getColSpanClass(field, group.length)}>
                      <FormLabel>{field.label}</FormLabel>

                      <FormControl>
                        {field.type === "textarea" ? (
                          <div className="relative">
                            <textarea
                              {...formField}
                              value={formField.value as string}
                              placeholder={field.placeholder}
                              rows={field.rows || 6}
                              maxLength={field.maxLength}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
                            />
                            {field.maxLength && (
                              <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                                {(formField.value as string)?.length || 0}/{field.maxLength}
                              </div>
                            )}
                          </div>
                        ) : field.dropdown ? (
                          // Dropdown as main control
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                className="w-full px-4 py-3 h-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-left bg-white hover:bg-gray-50 flex items-center justify-between"
                              >
                                <span className={formField.value ? "text-gray-900" : "text-gray-400"}>
                                  {formField.value || field.placeholder || "Select..."}
                                </span>
                                <svg
                                  className="w-4 h-4 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-full" align="start">
                              {field.dropdown.options.map((option) => (
                                <DropdownMenuItem
                                  key={option}
                                  onSelect={() => {
                                    formField.onChange(option);
                                    field.dropdown?.onSelect?.(option);
                                  }}
                                >
                                  {option}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          // Regular input with icons
                          <InputGroup>
                            {startIcons?.map((icon) => renderIconAddon(icon, field.name))}

                            <InputGroupInput
                              {...formField}
                              value={formField.value as string}
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
                                  onClick={() => togglePasswordVisibility(field.name)}
                                >
                                  {showPassword[field.name] ? (
                                    <EyeOff className="h-5 w-5 text-gray-400" />
                                  ) : (
                                    <Eye className="h-5 w-5 text-gray-400" />
                                  )}
                                </InputGroupButton>
                              </InputGroupAddon>
                            )}

                            {endIcons?.map((icon) => renderIconAddon(icon, field.name))}
                          </InputGroup>
                        )}
                      </FormControl>

                      {field.description && <FormDescription>{field.description}</FormDescription>}
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
                className="w-4 h-4 text-brand-primary bg-gray-100 border-gray-300 rounded focus:ring-brand-primary"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-sm font-medium text-brand-primary hover:underline">
              Forgot Password?
            </Link>
          </div>
        )}

        {showSubmitButton && (
          <div className={getButtonPositionClass()}>
            <Button
              type="button"
              onClick={formMethods.handleSubmit(handleFormSubmit)}
              disabled={isSubmitting || formMethods.formState.isSubmitting}
              className={`${submitButtonPosition === "full" ? "w-full" : ""} ${submitButtonStyle}`}
            >
              {isSubmitting ? "Please wait..." : submitButtonText}
            </Button>
          </div>
        )}
      </div>
    </Form>
  );
}
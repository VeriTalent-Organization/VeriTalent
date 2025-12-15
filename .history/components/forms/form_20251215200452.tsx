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
  colSpan?: number; 
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

// for rows
  const groupedFields = fields.reduce<Record<string, FieldConfig[]>>(
  (acc, field) => {
    const key = field.row ?? field.name; // standalone fields get own row
    acc[key] = acc[key] || [];
    acc[key].push(field);
    return acc;
  },
  {}
);
  return (
    <Form {...formMethods}>
      <div className={`space-y-6 ${classNames}`}>
        {fields.map((field) => (
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
                <FormItem>
                  <FormLabel>{field.label}</FormLabel>

                  <FormControl>
                    <InputGroup>
                      {startIcons?.map((icon) =>
                        renderIconAddon(icon, field.name)
                      )}

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

        <Button
          onClick={formMethods.handleSubmit(handleFormSubmit)}
          className={submitButtonStyle}
        >
          {submitButtonText}
        </Button>
      </div>
    </Form>
  );
}

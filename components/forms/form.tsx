"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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

// Dynamically generate schema based on fields
const generateSchema = (fields: FieldConfig[]) => {
  const shape = fields.reduce((acc, field) => {
    acc[field.name] = z.string().min(2, `${field.label} must be at least 2 characters.`);
    return acc;
  }, {} as Record<string, z.ZodString>);
  return z.object(shape);
};

// Icon position type
type IconPosition = "start" | "end" | "inline-start" | "inline-end";

// Dropdown configuration
interface DropdownConfig {
  options: string[];
  defaultValue?: string;
  onSelect?: (value: string) => void;
}

// Icon configuration
interface IconConfig {
  icon: React.ReactNode;
  position: IconPosition;
  type?: "icon" | "text" | "button";
  onClick?: () => void;
  tooltip?: string;
}

// Field configuration interface
interface FieldConfig {
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  type?: string;
  icons?: IconConfig[];
  dropdown?: DropdownConfig;
}

// Define props for the component
interface FormProps {
  fields: FieldConfig[];
  classNames?: string;
  submitButtonText?: string;
  submitButtonStyle?: string;
  formType?: string;
  submitFunction?: (data: Record<string, string>) => void;
}

export default function FormComponent({
  fields,
  classNames = "",
  submitButtonStyle = "",
  submitButtonText = "Submit",
  formType = "",
  submitFunction = () => {},
}: FormProps) {
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>(
    Object.fromEntries(fields.map((field) => [field.name, false]))
  );

  const [dropdownValues, setDropdownValues] = useState<Record<string, string>>(
    Object.fromEntries(
      fields
        .filter((field) => field.dropdown)
        .map((field) => [field.name, field.dropdown?.defaultValue || field.dropdown?.options[0] || ""])
    )
  );

  // Toggle password visibility
  const togglePasswordVisibility = (fieldName: string) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [fieldName]: !prevState[fieldName],
    }));
  };

  // Dynamically generate schema
  const formSchema = generateSchema(fields);

  // Initialize the useForm hook
  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: fields.reduce((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {} as Record<string, string>),
  });

  // Define the submit handler
  const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form submitted with data:", data);
    if (submitFunction) submitFunction(data);
  };

  // Render icon addon based on configuration
  const renderIconAddon = (iconConfig: IconConfig, fieldName: string) => {
    const align = iconConfig.position === "inline-start" || iconConfig.position === "inline-end" 
      ? iconConfig.position 
      : undefined;

    if (iconConfig.type === "button") {
      return (
        <InputGroupAddon align={align} key={`${fieldName}-${iconConfig.position}`}>
          <InputGroupButton
            type="button"
            onClick={iconConfig.onClick}
            className="rounded-full"
            size="icon-xs"
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
        {fields.map((field) => {
          const startIcons = field.icons?.filter(
            (icon) => icon.position === "start" || icon.position === "inline-start"
          );
          const endIcons = field.icons?.filter(
            (icon) => icon.position === "end" || icon.position === "inline-end"
          );

          return (
            <FormField
              key={field.name}
              control={formMethods.control}
              name={field.name}
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>{field.label}</FormLabel>
                  <FormControl>
                    <InputGroup>
                      {/* Render start icons */}
                      {startIcons?.map((iconConfig) => renderIconAddon(iconConfig, field.name))}

                      {/* Input field */}
                      <InputGroupInput
                        placeholder={field.placeholder}
                        type={
                          field.type === "password"
                            ? showPassword[field.name]
                              ? "text"
                              : "password"
                            : field.type || "text"
                        }
                        {...formField}
                      />

                      {/* Password toggle */}
                      {field.type === "password" && (
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton
                            type="button"
                            onClick={() => togglePasswordVisibility(field.name)}
                            variant="ghost"
                            size="sm"
                          >
                            {showPassword[field.name] ? "Hide" : "Show"}
                          </InputGroupButton>
                        </InputGroupAddon>
                      )}

                      {/* Render end icons */}
                      {endIcons?.map((iconConfig) => renderIconAddon(iconConfig, field.name))}

                      {/* Dropdown menu */}
                      {field.dropdown && (
                        <InputGroupAddon align="inline-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <InputGroupButton variant="ghost">
                                {dropdownValues[field.name]}
                              </InputGroupButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="bottom" align="end">
                              {field.dropdown.options.map((option) => (
                                <DropdownMenuItem
                                  key={option}
                                  onClick={() => {
                                    setDropdownValues((prev) => ({
                                      ...prev,
                                      [field.name]: option,
                                    }));
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
                    <FormDescription>{field.description}</FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}

        {formType === "login" && (
          <div className="text-right">
            <Link href="#" className="text-sm text-blue-600 hover:underline">
              Forgotten password?
            </Link>
          </div>
        )}

        <Button onClick={formMethods.handleSubmit(handleFormSubmit)} className={submitButtonStyle}>
          {submitButtonText}
        </Button>
      </div>
    </Form>
  );
}
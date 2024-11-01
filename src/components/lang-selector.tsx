"use client";

import { useTolgee, useTranslate, T } from "@tolgee/react";
import { setLanguage } from "@/tolgee/language";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import {
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";

export const LangSelector = () => {
  const tolgee = useTolgee(["language"]);
  const locale = tolgee.getLanguage();

  const { t } = useTranslate();

  function onSelectChange(value: string) {
    setLanguage(value);
  }

  return (
    <Select value={locale} onValueChange={onSelectChange}>
      <SelectTrigger className="w-[200px] border rounded-md">
        <SelectValue placeholder={t("select-a-language")} />
        <ChevronDown className="ml-2 w-4 h-4 inline" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel className="mb-1">
            <T keyName="language" />
          </SelectLabel>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="cs">Česky</SelectItem>
          <SelectItem value="fr">Français</SelectItem>
          <SelectItem value="de">Deutsch</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

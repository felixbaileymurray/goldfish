import React, { useMemo } from "react";
import type { ModelOption } from "./types";
import {
  Typeahead,
  type SearchableItem,
  type SearchSource,
} from "@astryxdesign/core";

const CREATE_PREFIX = "__create__:";

type ModelSelectProps = {
  value: string;
  options: ModelOption[];
  isDisabled?: boolean;
  placeholder?: string;
  onSelect: (value: string) => void;
  onCreate: (value: string) => void;
  className?: string;
};

export const ModelSelect: React.FC<ModelSelectProps> = React.memo(
  ({
    value,
    options,
    isDisabled,
    placeholder,
    onSelect,
    onCreate,
    className,
  }) => {
    const source = useMemo<SearchSource<SearchableItem>>(
      () => ({
        bootstrap: () => options.map((o) => ({ id: o.value, label: o.label })),
        search: (query: string) => {
          const q = query.toLowerCase().trim();
          const matches = options
            .filter((o) => o.label.toLowerCase().includes(q))
            .map((o) => ({ id: o.value, label: o.label }));
          const exactMatch = options.some(
            (o) => o.value.toLowerCase() === q || o.label.toLowerCase() === q,
          );
          if (q && !exactMatch) {
            matches.push({
              id: `${CREATE_PREFIX}${query}`,
              label: `Use "${query}"`,
            });
          }
          return matches;
        },
      }),
      [options],
    );

    const selectedItem: SearchableItem | null = value
      ? { id: value, label: value }
      : null;

    const handleChange = (item: SearchableItem | null) => {
      if (!item) return;
      if (item.id.startsWith(CREATE_PREFIX)) {
        onCreate(item.id.slice(CREATE_PREFIX.length));
      } else {
        onSelect(item.id);
      }
    };

    return (
      <Typeahead
        label="Model"
        isLabelHidden
        searchSource={source}
        value={selectedItem}
        onChange={handleChange}
        isDisabled={isDisabled}
        placeholder={placeholder}
        hasEntriesOnFocus
        hasClear
        debounceMs={0}
        className={className}
      />
    );
  },
);

ModelSelect.displayName = "ModelSelect";

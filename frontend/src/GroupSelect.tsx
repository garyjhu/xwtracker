import {
  Checkbox, Combobox, ComboboxDropdown,
  ComboboxDropdownTarget,
  ComboboxEventsTarget, ComboboxOption, ComboboxOptions, Group, InputPlaceholder,
  Pill,
  PillGroup,
  PillsInput, PillsInputField, useCombobox
} from "@mantine/core";
import { DashboardState, DashboardStateEventHandler } from "./Dashboard";
import { SolveGroup } from "./types";

type GroupSelectProps = Pick<DashboardState, "selectedGroups"> & {
  allGroups: SolveGroup[],
  onChange: DashboardStateEventHandler
}

const SELECT_ALL = "$ALL"

export default function GroupSelect({ selectedGroups, allGroups, onChange }: GroupSelectProps) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption,
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active")
  })

  const selectedAll = selectedGroups.size === allGroups.length

  const handleSelectAll = (selected: boolean) => {
    onChange({
      selectedGroups: new Set<string>(
        selected ? allGroups.map(group => group.name) : undefined
      )
    })
  }

  const handleValueSelect = (val: string) => {
    if (val === SELECT_ALL) {
      handleSelectAll(!selectedAll)
    }
    else {
      onChange({
        selectedGroups: new Set<string>(
          allGroups
            .filter(group => selectedGroups.has(group.name) !== (group.name === val))
            .map(group => group.name)
        )
      })
    }
  }

  const options = allGroups.map(group => (
    <ComboboxOption
      value={group.name}
      key={group.name}
      active={selectedGroups.has(group.name)}
    >
      <Group>
        <Checkbox
          checked={selectedGroups.has(group.name)}
          onChange={() => {}}
          style={{ pointerEvents: "none" }}
        />
        <Pill
          style={{ backgroundColor: group.color }}
        >
          {group.name}
        </Pill>
      </Group>
    </ComboboxOption>
  ))
  options.unshift((
    <ComboboxOption
      value={SELECT_ALL}
      key={SELECT_ALL}
      active={selectedAll}
    >
      <Group>
        <Checkbox
          checked={selectedAll}
          onChange={() => {}}
          style={{ pointerEvents: "none" }}
        />
        <span>
          Select all categories
        </span>
      </Group>
    </ComboboxOption>
  ))

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={handleValueSelect}
    >
      <ComboboxDropdownTarget>
        <PillsInput
          pointer
          onClick={() => combobox.toggleDropdown()}
          style={{ flexGrow: 1 }}
        >
          <PillGroup>
            {selectedGroups.size > 0 ? allGroups
              .filter(group => selectedGroups.has(group.name))
              .map(group => (
                <Pill
                  key={group.name}
                  withRemoveButton
                  onRemove={() => handleValueSelect(group.name)}
                  style={{ backgroundColor: group.color }}
                >
                  {group.name}
                </Pill>
              )) : (
              <InputPlaceholder>Choose one or more puzzle categories</InputPlaceholder>
            )}
            <ComboboxEventsTarget>
              <PillsInputField
                type={"hidden"}
              />
            </ComboboxEventsTarget>
          </PillGroup>
        </PillsInput>
      </ComboboxDropdownTarget>

      <ComboboxDropdown>
        <ComboboxOptions>
          {options}
        </ComboboxOptions>
      </ComboboxDropdown>
    </Combobox>
  )
}
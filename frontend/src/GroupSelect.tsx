import {
  Checkbox, Combobox, ComboboxDropdown,
  ComboboxDropdownTarget,
  ComboboxEventsTarget, ComboboxOption, ComboboxOptions, Group, InputPlaceholder,
  Pill,
  PillGroup,
  PillsInput, PillsInputField, useCombobox
} from "@mantine/core";
import { useAuthenticatedUser } from "./hooks";
import { useQuery } from "@tanstack/react-query";
import { fetchSolveGroups } from "./api";
import { useState } from "react";

interface GroupOptions {
  color: string,
  selected: boolean
}

type GroupOptionsMap = { [groupName: string]: GroupOptions }

const SELECT_ALL = "$ALL"

export default function GroupSelect() {
  const user = useAuthenticatedUser()
  const { isPending, isError, data, error, fetchStatus } = useQuery({
    queryKey: ["fetchGroupNames", user.uid],
    queryFn: async () => fetchSolveGroups(user)
  })

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption,
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active")
  })
  const [groupOptionsMap, setGroupOptionsMap] = useState<GroupOptionsMap>({})

  if (isPending) {
    return <span>Loading... {fetchStatus}</span>
  }

  if (isError) return <span>Error: {error.message}</span>

  const groupNames = Object.keys(groupOptionsMap)
  if (groupNames.length === 0) {
    let map: GroupOptionsMap = {}
    for (const group of data) {
      map[group.name] = { color: group.color, selected: true }
    }
    setGroupOptionsMap(map)
  }
  const selectedGroups = groupNames.filter(group => groupOptionsMap[group].selected)
  const selectedAll = selectedGroups.length === groupNames.length

  const handleValueSelect = (val: string) => {
    if (val === SELECT_ALL) {
      handleSelectAll(!selectedAll)
    }
    else {
      setGroupOptionsMap(map => ({
        ...map,
        [val]: {
          color: map[val].color,
          selected: !groupOptionsMap[val].selected
        }
      }))
    }
  }

  const handleSelectAll = (selected: boolean) => {
    let map: GroupOptionsMap = {}
    for (const group of data) {
      map[group.name] = {
        color: group.color,
        selected
      }
    }
    setGroupOptionsMap(map)
  }


  const options = groupNames.map(group => (
    <ComboboxOption
      value={group}
      key={group}
      active={groupOptionsMap[group].selected}
    >
      <Group>
        <Checkbox
          checked={groupOptionsMap[group].selected}
          style={{ pointerEvents: "none" }}
        />
        <Pill
          style={{ backgroundColor: groupOptionsMap[group].color }}
        >
          {group}
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
          style={{ width: 700 }}
        >
          <PillGroup>
            {selectedGroups.length > 0 ? selectedGroups
              .map(group => (
                <Pill
                  key={group}
                  withRemoveButton
                  onRemove={() => handleValueSelect(group)}
                  style={{ backgroundColor: groupOptionsMap[group].color }}
                >
                  {group}
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
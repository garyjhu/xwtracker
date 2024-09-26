import { Box, Button, Center } from "@mantine/core";
import { CSSProperties, Dispatch, forwardRef, Ref, SetStateAction, useImperativeHandle, useState } from "react";
import styles from "./Tooltip.module.css"
import PuzzleGrid from "./PuzzleGrid";
import { useQuery } from "@tanstack/react-query";
import { getSolveData } from "./api";
import { useAuthenticatedUser } from "./hooks";
import { getSolveTimeFormatted, getTitle } from "./tools";

interface TooltipState {
  solveDataId?: string,
  style?: CSSProperties
}

export type SetTooltipState = { setState: Dispatch<SetStateAction<TooltipState>> }

const ExternalTooltip = forwardRef(function ExternalTooltip(_, ref: Ref<SetTooltipState>) {
  const user = useAuthenticatedUser()
  const [state, setState] = useState<TooltipState>({})
  useImperativeHandle(ref, () => ({ setState }))

  const searchKey = { id: state.solveDataId }
  const { isPending, isError, data: solveData, error, fetchStatus } = useQuery({
    queryKey: ["getSolveData", user.uid, searchKey],
    queryFn: () => getSolveData(user, searchKey),
  })

  if (isPending) {
    return <span>Loading... {fetchStatus}</span>
  }

  if (isError) return <span>Error: {error.message}</span>

  return (
    <div className={styles["box-tooltip"]} id={"chartjs-tooltip"} style={state.style}>
      <Button className={styles.button} w={400}>
        <Center className={styles["box-puzzle"]}>
          {state.solveDataId && <PuzzleGrid searchKey={{ id: state.solveDataId }} solveData={solveData} />}
        </Center>
        <Box className={styles["box-info"]}>
          <h3>{getTitle(solveData)}</h3>
          <h3>{getSolveTimeFormatted(solveData)}</h3>
        </Box>
      </Button>
    </div>
  )
})

export default ExternalTooltip
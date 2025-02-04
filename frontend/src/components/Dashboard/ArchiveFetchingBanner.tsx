import { Loader } from "@mantine/core";
import { useAuthenticatedUser } from "../../auth/index.js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { checkJobStatus, deleteJob } from "../../services/backend.js";
import { DashboardBanner, DashboardBannerProps } from "./DashboardBanner.js";
import { useEffect, useState } from "react";
import { IconCircleCheckFilled } from "@tabler/icons-react";

export function ArchiveFetchingBanner() {
  const [state, setState] = useState<DashboardBannerProps>({ visible: false })

  const user = useAuthenticatedUser()
  const queryClient = useQueryClient()
  const { data: job } = useQuery({
    queryKey: ["checkJobStatus", user.uid],
    queryFn: async () => checkJobStatus(user),
    refetchInterval: query => query.state.data && !query.state.data.isComplete ? 5000 : 0
  })

  useEffect(() => {
    if (job) {
      const count = job.puzzlesFetched
      let title = job.isComplete
        ? "Fetching complete..."
        : "Fetching puzzles from the NYT archive..."
      if (job.isComplete || count > 0) title += ` found ${job.puzzlesFetched} new solved puzzles!`
      setState({
        color: job.isComplete ? "blue" : "green",
        icon: job.isComplete ? <IconCircleCheckFilled /> : <Loader size={"sm"} />,
        title,
        visible: true,
        withCloseButton: job.isComplete,
        onClose: () => setState({ visible: false })
      })
      void queryClient.invalidateQueries()
      if (job.isComplete) void deleteJob(user)
    }
  }, [queryClient, job, user]);

  return <DashboardBanner {...state} />
}
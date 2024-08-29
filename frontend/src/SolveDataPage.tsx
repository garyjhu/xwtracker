import {useQuery} from "@tanstack/react-query"
import {useParams} from "react-router-dom";
import axios from "axios";
import {GetSolveTimesResponse} from "./types";
import { getSolveTimesOptions } from "./api";
import { useUser } from "./hooks";

export default function SolveDataPage() {
  const { solveDataId } = useParams()
  const user = useUser()
  const solveDataQuery = useQuery({
    queryKey: ["getSolveData"]
  })
  const info = useQuery({ queryKey: ["solveTimes", ]})
  const solveTimesQuery = useQuery(getSolveTimesOptions(useUser(), solveData.group))
  const solveTimesList = solveTimesQuery.data
  if (!solveTimesList) return null
}
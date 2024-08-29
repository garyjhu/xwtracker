import { GraphProps, SolveData, SolveTimeListItem } from "./types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios/index";
import { Chart } from "react-chartjs-2";
import { getSolveTimesOptions } from "./api";
import { useUser } from "./hooks";

export default function DistributionGraph({ solveTimesList, solveData }: GraphProps) {
}

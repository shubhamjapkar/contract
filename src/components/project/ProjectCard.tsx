import {useEffect, useRef, useState} from "react";
import projectData from "../../data/project-data.json";
import {useAccount, useBalance} from "wagmi";
import {useParams} from "react-router-dom";
import PageNotFound from "../../NotFound.tsx";
import moment from "moment";
import {MintingInterface} from "../core/MintingInterface.tsx";


export default function ProjectCard() {

    return  <MintingInterface />
}
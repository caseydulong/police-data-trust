import * as d3 from "d3"
import { Feature, FeatureCollection } from "geojson"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import * as topojson from "topojson-client"
import { simplify } from "topojson-simplify"
import { Topology } from "topojson-specification"
import { PointCoord } from "../utilities/chartTypes"
import styles from "./map.module.css"

type StateID = string

type FakeData = {
  UID: number
  location: PointCoord | StateID
  value: number
}
export interface BaseMapProps {
  projection: d3.GeoProjection
  data: FakeData[]
}

export const getFakeData = () => {
  let data: FakeData[] = [
    {
      UID: 1,
      location: "04",
      value: 10
    },
    {
      UID: 2,
      location: "05",
      value: 30
    },
    {
      UID: 3,
      location: "06",
      value: 100
    },
    {
      UID: 4,
      location: "09",
      value: 70
    },
    {
      UID: 5,
      location: "10",
      value: 20
    },
        {
      UID: 6,
      location: "11",
      value: 10
    },
    {
      UID: 7,
      location: "12",
      value: 30
    },
    {
      UID: 8,
      location: "13",
      value: 100
    },
    {
      UID: 9,
      location: "14",
      value: 70
    },
    {
      UID: 10,
      location: "15",
      value: 20
    }
  ]
  return data
}

export default function BaseMap(props: BaseMapProps) {
  const baseMapRef = useRef(null)
  const { projection, data } = props
  const link: string = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json"
  const stateOnlyLink = "https://cdn.jsdelivr.net/npm/us-atlas@3.0.0/states-10m.json"

  const dataPromise = fetch(stateOnlyLink)

  const path = d3.geoPath().projection(projection)

  const opacityScale = d3.scaleLinear().domain([0, 50]).range([0, 1])

  useEffect(() => {
    if (!dataPromise) return
    dataPromise
      .then((res) => res.json())
      .then((topology: Topology) => {
        if (!topology) return
        const svg = d3
          .select(baseMapRef.current)
          .classed(styles.mapGeoShape, true)
          .classed(styles.state, true)
        const statesTopo = topojson.feature(topology, topology.objects.states) as FeatureCollection
        svg
          .selectAll("path")
          .data(statesTopo.features)
          .enter()
          .append("path")
          .attr("id", (d) => d.properties.name)
          .classed("state", true)
          .attr("d", path)
          .attr("fill-opacity", (d) => {
            const datum = data.find((i) => d.id === i.location)
            return datum ? opacityScale(Number(datum.value)) : 0.05
          })
      })  
  }, [data, dataPromise, opacityScale, path])

  return <svg id="map" viewBox={`0, 0, 1200, 700`} ref={baseMapRef}></svg>
}

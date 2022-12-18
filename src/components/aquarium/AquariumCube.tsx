import React from "react"
import styled from 'styled-components'
import { AQUARIUM_PART } from "../../utils/constants"
import AquariumWall from "./AquariumWall"
import AquariumWater from "./AquariumWater"

type ButtonProps = {
    aquariumPartSelected?: number
}

export default function AquariumCube({
    aquariumPartSelected,
}: ButtonProps) {

    return (

        <div className="relative w-[273px] h-52 skew-y-12" >
            {/* front */}
            <AquariumWall
                className={`
                z-20 
                ${aquariumPartSelected == AQUARIUM_PART.HEIGHT && 'border-x-[3px] border-x-red-500'} 
                ${aquariumPartSelected == AQUARIUM_PART.WIDTH && 'border-y-[3px] border-y-red-500'}
            `}
            />
            {/* water front */}
            <AquariumWater
                className={`
                z-10
                ${aquariumPartSelected == AQUARIUM_PART.WATER && 'border-x-[3px] border-x-red-500 z-30'} 
                translate-y-[47px]
            `}
            />
            {/* back */}
            <AquariumWall
                className={`
                ${aquariumPartSelected == AQUARIUM_PART.HEIGHT && 'border-x-[3px] border-x-red-500'} 
                ${aquariumPartSelected == AQUARIUM_PART.WIDTH && 'border-y-[3px] border-y-red-500'}
                translate-x-36
                -translate-y-24
            `}
            />
            {/* water back */}
            <AquariumWater
                className={`
                ${aquariumPartSelected == AQUARIUM_PART.WATER && 'border-x-[3px] border-x-red-500/50 z-10'} 
                translate-x-36
                -translate-y-12
            `}
            />
            {/* right */}
            <AquariumWall
                className={`
                w-[146px]
                z-10
                ${aquariumPartSelected == AQUARIUM_PART.LENGTH && 'border-y-[4px] border-y-red-500'} 
                -skew-y-[33.5deg]
                translate-x-[206px]
                -translate-y-[48px]
            `}
            />
            {/* water right */}
            <AquariumWater
                className={`
                w-[146px]
                ${aquariumPartSelected == AQUARIUM_PART.WATER && 'border-x-[3px] border-x-red-500 z-20'} 
                -skew-y-[33.5deg]
                translate-x-[206px]
            `}
            />
            {/* left */}
            <AquariumWall
                className={`
                w-[146px]
                ${aquariumPartSelected == AQUARIUM_PART.LENGTH && 'border-y-[4px] border-y-red-500'}
                -skew-y-[33.5deg]
                -translate-y-[48px]
            `}
            />
            {/* water left */}
            <AquariumWater
                className={`
                w-[146px]
                -skew-y-[33.5deg]
            `}
            />
            {/* water bottom */}
            <AquariumWater
                className={`
                w-[94px] h-[204px] 
                -rotate-[90deg]
                skew-y-[56deg]
                translate-x-[130px]
                translate-y-[56px]
            `}
            />
        </div>
    )
}
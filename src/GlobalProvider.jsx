import React, { createContext, useState, useEffect } from 'react'
import { baseSepolia } from 'thirdweb/chains'
import { client } from './client'
import { getContract } from 'thirdweb'
import { CROWDFUNDING_FACTORY } from './constants/contracts'
import { useReadContract } from 'thirdweb/react'

export const GlobalContext = createContext()

export const GlobalProvider = ({ children }) => {
  const [updatedCampaigns, setUpdatedCampaigns] = useState([])
  const contract = getContract({
    client: client,
    chain: baseSepolia,
    address: CROWDFUNDING_FACTORY,
  })

  const { data: campaigns, isPending } = useReadContract({
    contract,
    method:
      'function getAllCampaigns() view returns ((address campaignAddress, address owner, string name, uint256 creationTime, uint256 _durationInDays, uint256 _goal,)[])',
    params: [],
  })

  let reverseCampaigns = []
  let latestCampaigns = []

  useEffect(() => {
    if (campaigns && !isPending) {
      let cpyCampaigns = [...campaigns]

      cpyCampaigns.map((campaign, index) => {
        if (index > 42) {
          latestCampaigns = [...latestCampaigns, campaign]
        }
      })

      reverseCampaigns = latestCampaigns.reverse()
      const reverseCampaignsUpdate = reverseCampaigns.map((campaign) => ({
        ...campaign,
        state: 'notFinished',
      }))

      setUpdatedCampaigns(reverseCampaignsUpdate)
    }
  }, [campaigns])

  console.log('These is the array with added property: ', updatedCampaigns)

  return (
    <GlobalContext.Provider
      value={{
        updatedCampaigns,
        setUpdatedCampaigns,
        isPending,
        latestCampaigns,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

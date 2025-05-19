import { baseSepolia } from 'thirdweb/chains'
import { client } from './client'
import { getContract } from 'thirdweb'
import { CROWDFUNDING_FACTORY } from './constants/contracts'
import { useReadContract } from 'thirdweb/react'
import CampaignCard from './components/CampaignCard'
import { useContext, useEffect, useState } from 'react'
import { GlobalContext } from './GlobalProvider'

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(9)

  const { updatedCampaigns, isPending } = useContext(GlobalContext)

  let currentCampaigns = []
  const lastPostIndex = currentPage * postPerPage
  const firstPostIndex = lastPostIndex - postPerPage

  let numberOfPages = []

  const updatedCampaignsCpy = updatedCampaigns.filter(
    (campaign) => campaign.state === 'notFinished'
  )

  if (updatedCampaignsCpy && updatedCampaignsCpy.length > 0) {
    for (
      let i = 1;
      i <= Math.ceil(updatedCampaignsCpy.length / postPerPage);
      i++
    ) {
      numberOfPages = [...numberOfPages, i]
      console.log('This is the number being appended in pages array: ', i)
    }
    console.log('Number of pages: ', numberOfPages)
    currentCampaigns = updatedCampaignsCpy.slice(firstPostIndex, lastPostIndex)
  }

  return (
    <main className="mx-auto max-w-7xl px-4 mt-4 sm:px-6 lg:px-8">
      <div className="py-10">
        <h1 className="text-4xl font-bold mb-4 motion-preset-slide-left">
          Fundraising Projects:
        </h1>
        <div className="grid grid-cols-3 gap-4 motion-preset-slide-right">
          {!isPending &&
            updatedCampaigns &&
            (currentCampaigns.length > 0 ? (
              currentCampaigns.map((campaign) => {
                if (campaign.state === 'notFinished')
                  return (
                    <CampaignCard
                      key={campaign.campaignAddress}
                      campaignAddress={campaign.campaignAddress}
                    />
                  )
              })
            ) : (
              <p>No Fundraising Founds</p>
            ))}
        </div>
        <div className="w-screen  gap-4 mt-8 h-20 flex motion-preset-rebound-up">
          {!isPending &&
            updatedCampaigns &&
            numberOfPages &&
            numberOfPages.map((page, index) => {
              return (
                <button
                  className="h-12 w-12 text-2xl font-bold border-black border border-solid text-center hover:text-white hover:bg-black"
                  key={index}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              )
            })}
        </div>
      </div>
    </main>
  )
}

export const Pagination = () => {}

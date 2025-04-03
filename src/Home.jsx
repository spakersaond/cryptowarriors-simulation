import { baseSepolia } from 'thirdweb/chains'
import { client } from './client'
import { getContract } from 'thirdweb'
import { CROWDFUNDING_FACTORY } from './constants/contracts'
import { useReadContract } from 'thirdweb/react'
import CampaignCard from './components/CampaignCard'
import moment from 'moment'
import { useEffect, useState } from 'react'

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(9)

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
  if (campaigns) {
    let cpyCampaigns = [...campaigns]

    cpyCampaigns.map((campaign, index) => {
      if (index > 30) {
        latestCampaigns = [...latestCampaigns, campaign]
      }
    })

    reverseCampaigns = latestCampaigns.reverse()
  }

  let currentCampaigns = []
  const lastPostIndex = currentPage * postPerPage
  const firstPostIndex = lastPostIndex - postPerPage

  let numberOfPages = []

  if (reverseCampaigns && reverseCampaigns.length > 0) {
    for (let i = 1; i <= Math.ceil(latestCampaigns.length / postPerPage); i++) {
      numberOfPages = [...numberOfPages, i]
      console.log('This is the number being appended in pages array: ', i)
    }
    console.log('Number of pages: ', numberOfPages)
    currentCampaigns = reverseCampaigns.slice(firstPostIndex, lastPostIndex)
  }

  return (
    <main className="mx-auto max-w-7xl px-4 mt-4 sm:px-6 lg:px-8">
      <div className="py-10">
        <h1 className="text-4xl font-bold mb-4 motion-preset-slide-left">
          Fundraising Projects:
        </h1>
        <div className="grid grid-cols-3 gap-4 motion-preset-slide-right">
          {!isPending &&
            campaigns &&
            (currentCampaigns.length > 0 ? (
              currentCampaigns.map((campaign) => {
                // const dateObj = new Date(Number(campaign.creationTime) * 1000)
                // let dateNow = moment().format('YYYY-MM-DD')
                // let dateCreated = moment(dateObj).format('YYYY-MM-DD')
                // let dateOneFormatted = dateCreated.trim().split(' ').join('/')
                // let date1 = new Date(dateOneFormatted)
                // let dateTwoFormatted = dateNow.trim().split(' ').join('/')
                // let date2 = new Date(dateTwoFormatted)

                // // console.log("Date1 and Date2: ", date1, date2);

                // let Difference_In_Time = date2.getTime() - date1.getTime()

                // // Calculating the no. of days between
                // // two dates
                // let Difference_In_Days = Math.round(
                //   Difference_In_Time / (1000 * 3600 * 24)
                // )

                // // To display the final no. of days (result)
                // console.log(
                //   'Total number of days between dates:\n' +
                //     date1.toDateString() +
                //     ' and ' +
                //     date2.toDateString() +
                //     ' is: ' +
                //     Difference_In_Days +
                //     ' days'
                // )
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
            campaigns &&
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

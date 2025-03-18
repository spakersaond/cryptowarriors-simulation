import { baseSepolia } from 'thirdweb/chains'
import { client } from './client'
import { getContract } from 'thirdweb'
import { CROWDFUNDING_FACTORY } from './constants/contracts'
import { useReadContract } from 'thirdweb/react'
import CampaignCard from './components/CampaignCard'
import moment from 'moment'
import { Link } from 'react-router-dom'

export default function Home() {
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

  return (
    <main className="mx-auto max-w-screen max-h-screen w-screen h-screen mt-4 sm:px-6 lg:px-8 flex bg-slate-100">
      <div className="max-h-80 max-w-24 w-28  bg-slate-300 rounded-full mr-20 pt-12">
        <Link to="/">
          <img
            src="/grid2.png"
            className="w-[70px] mx-auto hover:bg-slate-500"
            alt="all-campaigns"
          />
        </Link>

        <Link>
          <img
            src="/profile.png"
            className="w-[70px] mx-auto pt-2 hover:bg-slate-500"
            alt="dashboard-page"
          />
        </Link>

        <Link>
          <img
            src="/instructions.png"
            className="w-[70px] mx-auto -mt-2 hover:bg-slate-500"
            alt="instructions"
          />
        </Link>
      </div>
      <div className="py-10 w-full">
        <h1 className="text-4xl font-bold mb-4">Fundraising Projects:</h1>
        <div className="grid grid-cols-3 gap-4">
          {!isPending &&
            campaigns &&
            (campaigns.length > 0 ? (
              campaigns.map((campaign) => {
                const dateObj = new Date(Number(campaign.creationTime) * 1000)
                let dateNow = moment().format('YYYY-MM-DD')
                let dateCreated = moment(dateObj).format('YYYY-MM-DD')
                let dateOneFormatted = dateCreated.trim().split(' ').join('/')
                let date1 = new Date(dateOneFormatted)
                let dateTwoFormatted = dateNow.trim().split(' ').join('/')
                let date2 = new Date(dateTwoFormatted)

                // console.log("Date1 and Date2: ", date1, date2);

                let Difference_In_Time = date2.getTime() - date1.getTime()

                // Calculating the no. of days between
                // two dates
                let Difference_In_Days = Math.round(
                  Difference_In_Time / (1000 * 3600 * 24)
                )

                // To display the final no. of days (result)
                console.log(
                  'Total number of days between dates:\n' +
                    date1.toDateString() +
                    ' and ' +
                    date2.toDateString() +
                    ' is: ' +
                    Difference_In_Days +
                    ' days'
                )

                if (Difference_In_Days < 1) {
                  return (
                    <CampaignCard
                      key={campaign.campaignAddress}
                      campaignAddress={campaign.campaignAddress}
                    />
                  )
                }
              })
            ) : (
              <p>No Fundraising Founds</p>
            ))}
        </div>
      </div>
    </main>
  )
}

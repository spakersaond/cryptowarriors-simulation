import { getContract } from 'thirdweb'
import { client } from '../../client'
import { baseSepolia } from 'thirdweb/chains'
import { CROWDFUNDING_FACTORY } from '../../constants/contracts'
import { useActiveAccount, useReadContract } from 'thirdweb/react'
import CampaignCard from '../../components/CampaignCard'
import { useState } from 'react'
import { deployPublishedContract } from 'thirdweb/deploys'
import moment from 'moment'
import { useParams } from 'react-router-dom'

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(3)
  const account = useActiveAccount()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const contract = getContract({
    client: client,
    chain: baseSepolia,
    address: CROWDFUNDING_FACTORY,
  })

  const {
    data: myCampaigns,
    isPending: isLoadingMyCampaigns,
    refetch,
  } = useReadContract({
    contract,
    method:
      'function getUserCampaigns(address _user) view returns ((address campaignAddress, address owner, string name, uint256 creationTime)[])',
    params: [String(account?.address)],
  })

  let reverseCampaigns = []
  let latestCampaigns = []

  if (myCampaigns && myCampaigns.length > 0) {
    let cpyCampaigns = [...myCampaigns]

    cpyCampaigns.map((campaign, index) => {
      if (
        account.address === '0x12891D99bf48a07CAFbD682f38A5595414728be5' &&
        index > 11
      ) {
        latestCampaigns = [...latestCampaigns, campaign]
      }
      if (account.address !== '0x12891D99bf48a07CAFbD682f38A5595414728be5') {
        latestCampaigns = [...latestCampaigns, campaign]
      }
    })
    console.log('Latest Camapaings EDITED: ', latestCampaigns)
    reverseCampaigns = latestCampaigns.reverse()
  }

  console.log('This is reverse Campaigns: ', reverseCampaigns)

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

  if (account) {
    if (
      account.address !== '0x12891D99bf48a07CAFbD682f38A5595414728be5' &&
      account.address !== '0x1871881ECF3415eE2F790b78f69678B8e3448624'
    ) {
      return (
        <div className="w-screen h-screen flex items-center justify-center ">
          <h1 className="text-5xl font-bold text-red-900 text-center overflow-y-hidden">
            RESTRICTED ACCESS!
          </h1>
        </div>
      )
    }
  }
  console.log('This is current campaigns: ', currentCampaigns)
  return (
    <div className="mx-auto max-w-7xl px-4 mt-16 sm:px-6 lg:px-8">
      <div className="flex flex-row justify-between items-center mb-8">
        <p className="text-4xl font-semibold">Dashboard</p>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={() => setIsModalOpen(true)}
        >
          Create Fundraising
        </button>
      </div>
      <p className="text-2xl font-semibold mb-4">My Fundraising Projects:</p>
      <div className="grid grid-cols-3 gap-4">
        {!isLoadingMyCampaigns &&
          myCampaigns &&
          (currentCampaigns && currentCampaigns.length > 0 ? (
            currentCampaigns.map((campaign, index) => {
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
                  key={index}
                  campaignAddress={campaign.campaignAddress}
                />
              )
            })
          ) : (
            <p>No campaigns found</p>
          ))}
      </div>
      <div className="w-screen  gap-4 mt-8 h-20 flex">
        {!isLoadingMyCampaigns &&
          myCampaigns &&
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

      {isModalOpen && (
        <CreateCampaignModal
          setIsModalOpen={setIsModalOpen}
          refetch={refetch}
        />
      )}
    </div>
  )
}

const CreateCampaignModal = ({ setIsModalOpen, refetch }) => {
  const account = useActiveAccount()
  const [campaignName, setCampaignName] = useState('')
  const [campaignDescription, setCampaignDescription] = useState('')
  const [campaignGoal, setCampaignGoal] = useState(1)
  const [campaignDeadline, setCampaignDeadline] = useState(1)
  const [isDeployingContract, setIsDeployingContract] = useState(false)

  const handleDeployContract = async () => {
    setIsDeployingContract(true)
    try {
      const contractAddress = await deployPublishedContract({
        client: client,
        chain: baseSepolia,
        account: account || '',
        contractId: 'Crowdfunding',
        contractParams: {
          _name: campaignName,
          _description: campaignDescription,
          _goal: campaignGoal,
          _durationInDays: 1,
        },
        publisher: '0x24D95b293b830De1969685626800B582367FAf5A',
        version: '1.0.0',
      })
      alert('Campaign created successfully!')
    } catch (error) {
      console.error(error)
    } finally {
      setIsDeployingContract(false)
      setIsModalOpen(false)
      refetch
    }
  }

  const handleCampaignGoal = (value) => {
    if (value < 1) {
      setCampaignGoal(1)
    } else {
      setCampaignGoal(value)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center backdrop-blur-md">
      <div className="w-1/2 bg-slate-100 p-6 rounded-md">
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-semibold">Create a Fundraising</p>
          <button
            className="text-sm px-4 py-2 bg-slate-600 text-white rounded-md"
            onClick={() => setIsModalOpen(false)}
          >
            Close
          </button>
        </div>
        <div className="flex flex-col">
          <label>Fundraising Name:</label>
          <input
            type="text"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            placeholder="Campaign Name"
            className="mb-4 px-4 py-2 bg-slate-300 rounded-md"
          />
          <label>Fundraising Description:</label>
          <textarea
            value={campaignDescription}
            onChange={(e) => setCampaignDescription(e.target.value)}
            placeholder="Campaign Description"
            className="mb-4 px-4 py-2 bg-slate-300 rounded-md"
          ></textarea>
          <label>Fundraising Goal:</label>
          <input
            type="number"
            value={campaignGoal}
            onChange={(e) => handleCampaignGoal(parseInt(e.target.value))}
            className="mb-4 px-4 py-2 bg-slate-300 rounded-md"
          />

          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={handleDeployContract}
          >
            {isDeployingContract
              ? 'Creating Fundraising `Project...'
              : 'Create Fundraising Project'}
          </button>
        </div>
      </div>
    </div>
  )
}

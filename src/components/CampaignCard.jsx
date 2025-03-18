import { getContract } from 'thirdweb'
import { baseSepolia } from 'thirdweb/chains'
import { client } from '../client'
import { useReadContract } from 'thirdweb/react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function CampaignCard({ campaignAddress }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const toggleExpand = () => setIsExpanded(!isExpanded)
  const maxLength = 150

  const contract = getContract({
    client: client,
    chain: baseSepolia,
    address: campaignAddress,
  })

  const { data: campaignName } = useReadContract({
    contract,
    method: 'function name() view returns (string)',
    params: [],
  })

  const { data: campaignDescription } = useReadContract({
    contract,
    method: 'function description() view returns (string)',
    params: [],
  })

  const { data: goal, isPending: isLoadingGoal } = useReadContract({
    contract,
    method: 'function goal() view returns (uint256)',
    params: [],
  })

  const { data: balance, isPending: isLoadingBalance } = useReadContract({
    contract,
    method: 'function getContractBalance() view returns (uint256)',
    params: [],
  })

  const totalBalance = balance?.toString()
  const totalGoal = goal?.toString()
  let balancePercentage =
    (parseInt(String(totalBalance)) / parseInt(String(totalGoal))) * 100

  if (balancePercentage >= 100) {
    balancePercentage = 100
  }

  return (
    <div className="flex flex-col justify-between max-w-sm p-6 bg-white border-solid border-2 border-slate-200 rounded-lg shadow">
      <div>
        {!isLoadingBalance && !isLoadingGoal && (
          <div className="mb-4">
            <div className="relative w-full h-6 bg-gray-700 rounded-full dark:bg-gray-700">
              <div
                className="h-6 bg-blue-600 rounded-full dark:bg-blue-500 text-right"
                style={{ width: `${balancePercentage?.toString()}%` }}
              >
                <p className="text-white dark:text-white text-xs p-1">
                  ${balance?.toString()}
                </p>
              </div>
              <p className="absolute top-0 right-0 text-white dark:text-white text-xs p-1">
                {balancePercentage >= 100
                  ? ''
                  : `${balancePercentage?.toString()}%`}
              </p>
            </div>
          </div>
        )}
        <h5 className="mb-2 text-2xl font-bold tracking-tight">
          {campaignName}
        </h5>
        {campaignDescription && campaignDescription.length > 0 && (
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            {isExpanded
              ? campaignDescription
              : campaignDescription.slice(0, maxLength) +
                (campaignDescription.length > maxLength ? '...' : '')}
            <button
              onClick={toggleExpand}
              className="mb-3 ml-3 font-bold text-black dark:text-gray-400"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          </p>
        )}
      </div>
      <Link to={`/campaign/${campaignAddress}`}>
        <p className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
          View Fundraising
          <svg
            className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </p>
      </Link>
    </div>
  )
}

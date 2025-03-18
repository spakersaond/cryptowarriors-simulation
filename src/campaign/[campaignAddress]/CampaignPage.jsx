import { client } from '../../client'
import TierCard from '../../components/TierCard'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getContract, prepareContractCall } from 'thirdweb'
import { baseSepolia } from 'thirdweb/chains'
import {
  lightTheme,
  TransactionButton,
  useActiveAccount,
  useReadContract,
} from 'thirdweb/react'

export default function CampaignPage() {
  const account = useActiveAccount()
  const { campaignAddress } = useParams()
  const [isEditing, setIsEditing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isGoalAchieved, setIsGoalAchieved] = useState(false)

  const contract = getContract({
    client: client,
    chain: baseSepolia,
    address: String(campaignAddress),
  })

  const { data: name, isLoading: isLoadingName } = useReadContract({
    contract: contract,
    method: 'function name() view returns (string)',
    params: [],
  })

  const { data: description } = useReadContract({
    contract,
    method: 'function description() view returns (string)',
    params: [],
  })

  const { data: deadline, isPending: isLoadingDeadline } = useReadContract({
    contract,
    method: 'function deadline() view returns (uint256)',
    params: [],
  })

  const deadlineDate = new Date(parseInt(String(deadline?.toString())) * 1000)
  console.log('Deadline Date: ', deadlineDate)
  const deadlineDatePassed = deadlineDate < new Date()

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

  const { data: tiers, isPending: isLoadingTiers } = useReadContract({
    contract,
    method:
      'function getTiers() view returns ((string name, uint256 amount, uint256 backers)[])',
    params: [],
  })

  const { data: owner, isPending: isLoadingOwner } = useReadContract({
    contract,
    method: 'function owner() view returns (address)',
    params: [],
  })

  const { data: status } = useReadContract({
    contract,
    method: 'function state() view returns (uint8)',
    params: [],
  })

  let totalBackers
  if (tiers) {
    totalBackers = tiers.reduce((sum, tier) => sum + Number(tier.backers), 0)
  }

  useEffect(() => {
    if (balance >= goal) {
      setIsGoalAchieved(true)
    }
  }, [balance])

  console.log('this is the balance: ', balance)

  return (
    <div className="mx-auto max-w-7xl px-2 mt-4 sm:px-6 lg:px-8">
      <div className="flex flex-row justify-between items-center motion-preset-slide-up">
        {!isLoadingName && <p className="text-4xl font-semibold">{name}</p>}

        {owner === account?.address && (
          <div className="flex flex-row">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Done' : 'Edit'}
            </button>
          </div>
        )}
      </div>

      {/* {owner === account?.address && balance >= goal && (
        <div className="flex flex-row">
          <TransactionButton
            transaction={() =>
              prepareContractCall({
                contract,
                method: 'function withdraw()',
                params: [],
              })
            }
            onTransactionConfirmed={async () => {
              alert('Withdraw succesfully')
            }}
            theme={lightTheme()}
            style={{
              marginTop: '1rem',
              backgroundColor: 'green',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontWeight: 'bold',
              padding: '1rem',
            }}
            disabled={balance <= 0 && totalBackers > 0}
          >
            Withdraw
          </TransactionButton>
        </div>
      )} */}

      <div className="my-4 motion-preset-slide-up">
        <p className="text-lg font-semibold">Description:</p>
        <p>{description}</p>
      </div>

      {!isLoadingBalance && !isLoadingGoal && (
        <div className="mb-4 motion-preset-slide-up">
          <p className="text-lg font-semibold">
            Fundraising Goal: ${goal?.toString()}
          </p>
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
      <div>
        {balance >= goal ? (
          <p className="text-2xl font-bold text-green-600">
            Goal Reached!{' '}
            <span className="text-red-900">Can't fund no more</span>
          </p>
        ) : (
          ''
        )}
        <p className="text-lg font-semibold">Tiers: </p>
        <div className="grid grid-cols-3 gap-4 motion-preset-shrink overflow-y-hidden overflow-hidden">
          {balance >= goal || (Number(balance) === 0 && totalBackers > 0)
            ? ''
            : tiers && tiers.length > 0
            ? tiers.map((tier, index) => (
                <TierCard
                  key={index}
                  tier={tier}
                  index={index}
                  contract={contract}
                  isEditing={isEditing}
                />
              ))
            : !isEditing && <p>No Tiers Available</p>}
          {isEditing && (
            <button
              className="max-w-sm flex flex-col text-center justify-center items-center font-semibold p-6 bg-blue-500 text-white border border-slate-100 rounded-lg shadow"
              onClick={() => setIsModalOpen(true)}
            >
              Add Tier
            </button>
          )}
        </div>
      </div>
      {isModalOpen && (
        <CreateTierModal setIsModalOpen={setIsModalOpen} contract={contract} />
      )}
    </div>
  )
}

const CreateTierModal = ({ setIsModalOpen, contract }) => {
  const [tierName, setTierName] = useState('')
  const [tierAmount, setTierAmount] = useState(BigInt(1))

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center backdrop-blur-md">
      <div className="w-1/2 bg-slate-100 p-6 rounded-md">
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-semibold">Create a funding Tier</p>
          <button
            className="text-sm px-4 py-2 bg-slate-600 text-white rounded-md"
            onClick={() => setIsModalOpen(false)}
          >
            Close
          </button>
        </div>
        <div className="flex flex-col">
          <label>Tier Name: </label>
          <input
            type="text"
            value={tierName}
            onChange={(e) => setTierName(e.target.value)}
            placeholder="Tier Name"
            className="mb-4 px-4 py-2 bg-slate-200 rounded-md"
          />
          <label>Tier Cost: </label>
          <input
            type="text"
            value={parseInt(tierAmount.toString())}
            onChange={(e) => setTierAmount(BigInt(e.target.value))}
            className="mb-4 px-4 py-2 bg-slate-200 rounded-md"
          />
          <TransactionButton
            transaction={() =>
              prepareContractCall({
                contract,
                method: 'function addTier(string _name, uint256 _amount)',
                params: [tierName, tierAmount],
              })
            }
            onTransactionConfirmed={async () => {
              alert('Tier added successfully!')
              setIsModalOpen(false)
            }}
            theme={lightTheme()}
          >
            Add Tier
          </TransactionButton>
        </div>
      </div>
    </div>
  )
}

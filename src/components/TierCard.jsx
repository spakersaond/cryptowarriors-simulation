import { prepareContractCall } from 'thirdweb'
import { TransactionButton } from 'thirdweb/react'

export default function TierCard({ tier, index, contract, isEditing }) {
  return (
    <div className="max-w-sm flex flex-col justify-between p-6 bg-white border border-slate-100 rounded-lg shadow">
      <div>
        <div className="flex flex-row justify-between items-center">
          <p className="text-2xl font-semibold">{tier.name}</p>
          <p className="text-2xl font-semibold">${tier.amount.toString()}</p>
        </div>
      </div>
      <div className="flex flex-row justify-between items-end overflow-y-hidden overflow-x-hidden">
        <p className="text-xs font-semibold">
          Total Backers: {tier.backers.toString()}
        </p>
        <TransactionButton
          transaction={() =>
            prepareContractCall({
              contract,
              method: 'function fund(uint256 _tierIndex) payable',
              params: [BigInt(index)],
              value: tier.amount,
            })
          }
          onTransactionConfirmed={async () => alert('Funded Successfully!')}
          style={{
            marginTop: '1rem',
            backgroundColor: '#2563EB',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            overflowY: 'hidden',
            overflowX: 'hidden',
            height: '50px',
          }}
        >
          Select
        </TransactionButton>
      </div>
      {isEditing && (
        <TransactionButton
          transaction={() =>
            prepareContractCall({
              contract,
              method: 'function removeTier(uint256 _index)',
              params: [BigInt(index)],
            })
          }
          onTransactionConfirmed={async () => alert('Removed successfully!')}
          style={{
            marginTop: '1rem',
            backgroundColor: 'red',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            cursor: 'pointer',
          }}
        >
          Remove
        </TransactionButton>
      )}
    </div>
  )
}

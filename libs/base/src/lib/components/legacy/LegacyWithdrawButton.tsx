import { useMemo } from 'react'

import { UnstyledButton } from '@apps/dumb-components'
import { constants } from 'ethers'
import styled from 'styled-components'
import { useAccount, useContractReads } from 'wagmi'

import { legacyContracts, StakingABI, vfuryABI } from './constants'
import { useLegacyWithdrawModal } from './useLegacyWithdrawModal'

import type { BigNumber } from 'ethers'

const StyledButton = styled(UnstyledButton)`
  align-items: center;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  font-weight: 600;
  height: 2rem;
  justify-content: space-between;
  line-height: 100%;
  transition: all 0.3s ease;
  background: ${({ theme }) => theme.color.yellowTransparent};
  border: 1px solid ${({ theme }) => theme.color.orange};
  white-space: nowrap;

  .warning {
    padding-bottom: 1px;
    margin-right: 4px;
  }

  &:hover {
    background: rgba(255, 179, 52, 0.5);
  }
`

export const LegacyWithdrawButton = () => {
  const { address } = useAccount()
  const contracts = legacyContracts.map(c => ({
    addressOrName: c.address,
    contractInterface: c.poolType === 'vfury' ? vfuryABI : StakingABI,
    functionName: c.poolType === 'vfury' ? 'staticBalanceOf' : 'balanceOf',
    args: [address],
  }))
  const { data } = useContractReads({ contracts, allowFailure: true })
  const contractsWithBalance = useMemo(
    () => legacyContracts.filter((_, idx) => !!data?.[idx] && (data?.[idx] as unknown as BigNumber).gt(constants.Zero)),
    [data],
  )
  const [openModal] = useLegacyWithdrawModal()

  if (!contractsWithBalance?.length) {
    return null
  }

  return (
    <StyledButton onClick={openModal}>
      <span role="img" aria-label="warning" className="warning">
        ⚠️
      </span>
      Legacy Stake
    </StyledButton>
  )
}

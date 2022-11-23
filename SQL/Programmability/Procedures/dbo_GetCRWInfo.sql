CREATE PROCEDURE [dbo].[GetCRWInfo]   -- exec GetCRWInfo 1,1,60
(
	@BudgetFileID int,
	@BudgetID int,
	@Prodid int
)
AS
BEGIN

    declare @ClosePeriodCheck int;
	declare @OpenPeriodCheck int;
    declare @StartDate datetime;
    declare @enddate datetime;
	declare @CID int;
--    declare @COACode varchar(100);

	select @CID=CompanyID from BudgetFile where BudgetFileID=@BudgetFileID and prodid=@Prodid;

	select  @StartDate=StartPeriod  from Closeperiod  where  CompanyID=@CID and Periodstatus='Current' and Status='Open';
	set @enddate=getdate();
	
--	set @COACode= (select segstr1  from Budgetfile where Budgetfileid=@BudgetFileID and BudgetId=@BudgetID)+'|';

Select A.Accountid as CHILD
, A.Accountcode
, case when A.ParentID = 1 then 0 else A.ParentID end as PARENT
, COA.detaillevel
, COA.COAID
, A.AccountName
--,ROUND(ISnull(case when Par.Pcount >0 then 0 else EC.EFC end,0),00) as EFC
, ROUND(ISNULL(C.BudgetTotal,0.00),00) as Budget
, A.Posting
, ROUND(ISNULL(PO.POAmount,0),00) as POAmount
, ROUND(ISNULL(ACT.ActualtoDate,0),00) as ActualtoDate
, ROUND(ISNULL(ACTP.ActualPeriod,0),00) as ActualPeriod
, ROUND(ISnull(C.EFCTotal,0),00) as EFC
, ROUND(ISnull(C.ETC,0),00) as ETC
, ROUND(isnull(Par.Pcount,0),00) as Childcount
, A.sublevel-1 as GENERATION
, SS3 as hierarchy
, 0.0 as aa,0.0 as bb,0.0 as cc,0.0 as dd -- Placeholder for Budget1,POAmount1,ActualtoDate1,ActualthisPeriod1
,0 as NotesCount
, isnull(C.ExpandValue,0) as ExpandValue
, 'DETAIL' as Type
, ROUND(ISNULL(ACTWOS.ActualtoDateWithOutSet,0),00) as ActualtoDateWithOutSet
, ROUND(ISNULL(ACTPWOS.ActualthisPeriodWithOutSet,0),00) as ActualthisPeriodWithOutSet
, ROUND(ISNULL(C.SetBudget,0),00) as SetBudget
, ROUND(ISNULL(C.SetEFC,0),00) as SetEFC
, ROUND(ISNULL(C.BlankBudget,0),00) as BlankBudget
, ROUND(C.BlankEFC,00) as BlankEFC
from (select COA.*, SegStr1 from COA join BudgetFile BF on COA.ParentCode = BF.SegStr1 and BF.BudgetFileID=@BudgetFileID and BF.BudgetID=@BudgetID) as COA
join tblAccounts A on COA.accountid = A.accountid
left join (select ParentId,sublevel-1 as sublevel, Count(ParentId) as PCount from tblAccounts where segmentType = 'Detail' group by ParentID,sublevel
			) as Par
	on ((A.accountid = Par.ParentId and A.sublevel = Par.sublevel))
left join CRWEFCandBudget as C
	on COA.COAID = C.COAID and C.BudgetID = @BudgetID and C.BUDGETFILEID=@BudgetFileID
/*left join  CRWEstimatedCost_Fix EC 
	on COA.COAID = EC.COAID and EC.BudgetFileID = @BudgetFileID and EC.BudgetID = @BudgetID
*/
left join (
		select COAID,isnull(sum(
						case when PO.Status = 'Closed' then null else POL.DisplayAmount end
						),0.00) as POAmount  
		from PurchaseOrderline POL
		join PurchaseOrder PO on POL.POID = PO.POID
		where PolineStatus<>'Paid' group by COAID
	) as PO
	on COA.COAID = PO.COAID
left join (select COAID, isnull(isnull(sum(a.debitAmount),0)-Isnull(sum(creditamount),0),0) ActualtoDate
			from JOurnalEntrydetail a Inner Join JOurnalEntry b on a.JOurnalEntryID=b.JournalEntryID
			where  b.Auditstatus='Posted' and b.Posteddate is not null group by COAID) as ACT	
	on COA.COAID = ACT.COAID
left join (select COAID, isnull(isnull(sum(a.debitAmount),0)-Isnull(sum(creditamount),0),0) ActualPeriod
			from JOurnalEntrydetail a Inner Join JOurnalEntry b on a.JOurnalEntryID=b.JournalEntryID
			join ClosePeriod CP on b.closeperiod = CP.ClosePeriodid
			where  b.Auditstatus='Posted' and b.Posteddate is not null  and CP.PeriodStatus='Current' group by COAID) as ACTP
	on COA.COAID = ACTP.COAID
left join (select  COAID,isnull(isnull(sum(a.debitAmount),0)-Isnull(sum(creditamount),0),0) as ActualtoDateWithOutSet
			from JOurnalEntrydetail a 
			Join JOurnalEntry b on a.JOurnalEntryID=b.JournalEntryID
			where  b.Auditstatus='Posted' and b.Posteddate is not null  and SetId is null group by COAID) as ACTWOS
	on COA.COAID = ACTWOS.COAID
left join (select COAID, isnull(isnull(sum(a.debitAmount),0)-Isnull(sum(creditamount),0),0) ActualthisPeriodWithOutSet
			from JOurnalEntrydetail a Inner Join JOurnalEntry b on a.JOurnalEntryID=b.JournalEntryID
			join ClosePeriod CP on b.closeperiod = CP.ClosePeriodid
			where  b.Auditstatus='Posted' and b.Posteddate is not null  and CP.PeriodStatus='Current' and SetId is null group by COAID) as ACTPWOS
	on COA.COAID = ACTPWOS.COAID
/*left join (select COAID, BudgetID, BUDGETFILEID, isnull(sum(cast(ECS.Budget as float)),0) as SetBudget,isnull(sum(cast(EFC as float)),0) as SetEFC
			from EstimatedCostSet ECS
			where ECS.BudgetID = @BudgetID and ECS.BudgetFileID = @BudgetFileID
			group by BudgetID, BUDGETFILEID, COAID) as ECS
	on COA.COAID = ECS.COAID and C.BUDGETFILEID = ECS.BUDGETFILEID and C.BudgetID = ECS.BudgetID
*/
where COA.Prodid = @Prodid
and A.AccountTypeID in (6,7,8,9,10,11,12,13)
--and A.accountcode like '12%' or a.accountcode like '11%'
order by Accountcode
end
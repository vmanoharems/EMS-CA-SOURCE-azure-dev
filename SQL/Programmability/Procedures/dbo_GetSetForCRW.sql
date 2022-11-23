SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE PROCEDURE [dbo].[GetSetForCRW] -- GetSetForCRW 222,1,1,3
	@COAID int ,
	@BudgetFileID int,
	@BudgetID int,
	@Prodid int

AS
BEGIN


declare @SegmentId int;
declare @StartDate  Datetime;
declare @Enddate Datetime;
	
	declare @CID int;

	select @CID=CompanyID from BudgetFile where BudgetFileID=@BudgetFileID and prodid=@Prodid;

    select  @StartDate=StartPeriod  from ClosePeriod  where Companyid=@CID and Periodstatus='Current' and Status='Open'
	set @Enddate=getdate();


set @SegmentId=(select Segmentid from Segment where Classification='Set' and ProdId=@Prodid)

declare @DLevel int;

select @DLevel=DetailLevel from COA where COAID=@COAID

select coa.COAID,a.AccountCode as [SetCode],
a.AccountName as SetDescription, a.AccountID as SetID,dbo.GetPoAmountforSet(@COAID,a.AccountID) as POAmountForSet,
dbo.GetActualtoDateforSet(@COAID,a.AccountID) as ActualtoDateforSet,dbo.GetActualthisPeriodforSet(@COAID,@StartDate,@Enddate,a.AccountID)
as ActualthisPeriodforSet,@DLevel as DetailLevel ,isnull(c.Budget,0)as Budget,isnull(c.EFC,0)as EFC
from COA Cross Join  tblaccounts a 
left join EstimatedCostSet as c on COA.COAID=c.COAID and a.AccountID=c.SetID and c.BudgetID=@BudgetID and c.BudgetFileID=@BudgetFileID
 where 
COA.COAID=@COAID
and a.SegmentID=@SegmentId  Order By [SetCode]

END





GO
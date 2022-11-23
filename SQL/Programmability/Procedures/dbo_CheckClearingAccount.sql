SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO



-- =============================================
CREATE PROCEDURE [dbo].[CheckClearingAccount] -- exec CheckClearingAccount 1,3
(
@PayrollFileID int,
@ProdId int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	 declare @LaborClearingAccountCnt int;
	 declare @FringeClearingAccountCnt int;
	  declare @companyID int;

	 declare @LaborClearing int;
	 declare @FringeClearing int;

	 declare @LaborAcResult varchar(100);
	 declare @FringeAcResult varchar(100);

	 select @companyID=CompanyID from PayrollFile where PayrollFileID=@PayrollFileID

	  select @LaborClearing= isnull(count(*),0)
     from PayrollExpensePost as a inner join TblAccounts as b on a.AccountNumber=b.AccountCode 
     where a.PayrollFileID=@PayrollFileID and a.AccountNumber not like '%99' and b.SegmentType='Detail'

     select @FringeClearing=isnull(count(*),0) from PayrollExpensePost as a
     inner join TblAccounts as b on a.AccountNumber=b.AccountCode 
     where a.PayrollFileID=@PayrollFileID
     and a.AccountNumber like '%99' and b.SegmentType='Detail'

	
     select @LaborClearingAccountCnt=count(*) from AccountClearing
	  where Type='Payroll' and AccountName='Labor' and CompanyId=@companyID and ProdId=@ProdId;
     select @FringeClearingAccountCnt=count(*) from AccountClearing where Type='Payroll'
	  and AccountName='Fringe' and CompanyId=@companyID and ProdId=@ProdId;



	 if exists(select COAId from AccountClearing where Type='Payroll' and AccountName='Labor' and CompanyId=@companyID and ProdId=@ProdId)
	 begin
	      	   
	    set @LaborAcResult='OK';
	 end
	 else
	 begin
	  set @LaborAcResult='ERROR';
	 end

	 

	 if exists (select COAId from AccountClearing where Type='Payroll' and AccountName='Fringe' and CompanyId=@companyID and ProdId=@ProdId)
	  begin
	      	   
	    set @FringeAcResult='OK';
	 end
	 else
	 begin
	  set @FringeAcResult='ERROR';
	 end


	 -- if(@FringeClearing=@FringeClearingAccountCnt)
	 --begin
	 --set @FringeAcResult='OK';
	 --end
	 --else  if(@FringeClearingAccountCnt<0)
	 --begin
	 -- set @FringeAcResult='ERROR';
	 --end
	 --else  if(@FringeClearingAccountCnt>0)
	 --begin
	 -- set @FringeAcResult='OK';
	 --end
	


	 select @LaborAcResult as LACCOUNT, @FringeAcResult as FACCOUNT

END




GO
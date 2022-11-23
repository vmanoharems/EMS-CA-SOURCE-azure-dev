SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetCOAForClearing]

@ProdId int,
@AccountType int,
@CompanyId int,
@Bankid int,
@ClearingType nvarchar(50),
@SegmentPosition int,
@COACode nvarchar(50),
@AccountName nvarchar(20)
AS
BEGIN

	SET NOCOUNT ON;
	declare @DT varchar(20);

	declare @SegmentDT int,@CompanyCode nvarchar(5)
	set @CompanyCode=(select CompanyCode from Company where CompanyID=@CompanyId)

	if(@ClearingType='Account')
	begin


	
	if(@AccountType>0)
	begin
	if(@AccountType=4)
	begin
		select distinct a.AccountCode as COANo,a.AccountCode as COACode,a.AccountId as COAID  from  tblaccounts a
	   where  a.Posting=1 and a.AccountTypeid=@AccountType and 
	 a.AccountId  not in  (select isnull(COAID,0) from AccountClearing  where Type='Bank' and BankId<>@Bankid and Accountname=@AccountName and ProdId=@ProdId )
	
	end
	else if (@AccountType=5)
	begin

	if @AccountName='APClearing'
	begin
		select  distinct a.AccountCode as COANo,a.AccountCode as COACode,a.AccountId as COAID  from  tblaccounts a
	  where  a.ProdId=@ProdId and a.Posting=1 and  a.AccountTypeid=@AccountType 
		and a.AccountId  not in (select COAID  from AccountClearing  where BankId<>@Bankid and accountname=@AccountName and ClearingType='Account')
		end
		else

	begin
	select  distinct a.AccountCode as COANo,a.AccountCode as COACode,a.AccountId as COAID  from  tblaccounts a
	  where  a.ProdId=@ProdId and a.Posting=1 and  a.AccountTypeid=@AccountType 
		and a.AccountId  not in (select COAID  from AccountClearing  where  CompanyId<>@Companyid and accountname=@AccountName and ClearingType='Account')

	end
	end

	end

	else
	begin
	
select  distinct a.AccountCode as COANo,a.AccountCode as COACode,a.AccountId COAID  from  tblaccounts a
	  where  a.ProdId=@ProdId and a.Posting=1 and  a.AccountTypeid in(4,5)
	end

	end
	else
	begin
	if(@SegmentPosition=0)
	begin

	select SS1 as COANo,COACode,COAID  from COA  where ss2='' and ProdID=@ProdID
	end
	else if(@SegmentPosition=1)
	begin
	set @DT=(select classification   from segment where SegmentLevel=2 and Prodid=@ProdID);

	If (@DT='Detail')

	begin
	if (@AccountName='Apclearing')
	begin

	select a.AccountCode as COANo,COACode,COAID  from COA inner Join tblaccounts a
	on a.AccountId=coa.AccountId   where ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1 
	and	 coa.AccountTypeid=@AccountType and coa.SS1=@CompanyCode
	and COA.COAID  not  in (select isnull(COAID,0)  from AccountClearing  where ClearingType='COA' and AccountName=@AccountName and BankId<>@Bankid)
	end

	else

	begin
	
	select a.AccountCode as COANo,COACode,COAID  from COA inner Join tblaccounts a
	on a.AccountId=coa.AccountId   where ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1 
	and	 coa.AccountTypeid=@AccountType and coa.SS1=@CompanyCode
	and COA.COAID  not  in (select isnull(COAID,0)  from AccountClearing  where ClearingType='COA' and AccountName=@AccountName and CompanyId<>@CompanyId)

	end
	end

	else
	begin
	select SS2 as COANo,COACode,COAID  from COA  where ParentCode=@COACode and ProdID=@ProdID
	end
	end
	else if(@SegmentPosition=2)
	begin
	set @DT=(select classification   from segment where SegmentLevel=3 and Prodid=@ProdID);

	If (@DT='Detail')

	begin
	if (@AccountName='Apclearing')
	begin

	select a.AccountCode as COANo,COACode,COAID  from COA inner Join tblaccounts a
	on a.AccountId=coa.AccountId   where ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1 
	and	 coa.AccountTypeid=@AccountType and coa.SS1=@CompanyCode
	and COA.COAID  not  in (select isnull(COAID,0)  from AccountClearing  where ClearingType='COA' and AccountName=@AccountName and BankId<>@Bankid)
	end

	else

	begin
	
	select a.AccountCode as COANo,COACode,COAID  from COA inner Join tblaccounts a
	on a.AccountId=coa.AccountId   where ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1 
	and	 coa.AccountTypeid=@AccountType and coa.SS1=@CompanyCode
	and COA.COAID  not  in (select isnull(COAID,0)  from AccountClearing  where ClearingType='COA' and AccountName=@AccountName and CompanyId<>@CompanyId)

	end
	end

	else
	begin
	select SS3 as COANo,COACode,COAID  from COA  where ParentCode=@COACode and ProdID=@ProdID
	end
	end
	else if(@SegmentPosition=3)
	begin
	set @DT=(select classification   from segment where SegmentLevel=4 and Prodid=@ProdID);

	If (@DT='Detail')

	begin
	if (@AccountName='Apclearing')
	begin

	select a.AccountCode as COANo,COACode,COAID  from COA inner Join tblaccounts a
	on a.AccountId=coa.AccountId   where ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1 
	and	 coa.AccountTypeid=@AccountType and coa.SS1=@CompanyCode
	and COA.COAID  not  in (select isnull(COAID,0)  from AccountClearing  where ClearingType='COA' and AccountName=@AccountName and BankId<>@Bankid)
	end

	else

	begin
	
	select a.AccountCode as COANo,COACode,COAID  from COA inner Join tblaccounts a
	on a.AccountId=coa.AccountId   where ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1 
	and	 coa.AccountTypeid=@AccountType and coa.SS1=@CompanyCode
	and COA.COAID  not  in (select isnull(COAID,0)  from AccountClearing  where ClearingType='COA' and AccountName=@AccountName and CompanyId<>@CompanyId)

	end
	end

	else
	begin
	select SS4 as COANo,COACode,COAID  from COA  where ParentCode=@COACode and ProdID=@ProdID
	end
	end
	else if(@SegmentPosition=4)
	begin
	set @DT=(select classification   from segment where SegmentLevel=5 and Prodid=@ProdID);

	If (@DT='Detail')

	begin
	if (@AccountName='Apclearing')
	begin

	select a.AccountCode as COANo,COACode,COAID  from COA inner Join tblaccounts a
	on a.AccountId=coa.AccountId   where ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1 
	and	 coa.AccountTypeid=@AccountType and coa.SS1=@CompanyCode
	and COA.COAID  not  in (select isnull(COAID,0)  from AccountClearing  where ClearingType='COA' and AccountName=@AccountName and BankId<>@Bankid)
	end

	else

	begin
	
	select a.AccountCode as COANo,COACode,COAID  from COA inner Join tblaccounts a
	on a.AccountId=coa.AccountId   where ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1 
	and	 coa.AccountTypeid=@AccountType and coa.SS1=@CompanyCode
	and COA.COAID  not  in (select isnull(COAID,0)  from AccountClearing  where ClearingType='COA' and AccountName=@AccountName and CompanyId<>@CompanyId)

	end
	end

	else
	begin
	select SS5 as COANo,COACode,COAID  from COA  where ParentCode=@COACode and ProdID=@ProdID
	end
	end
	else if(@SegmentPosition=5)
	begin
	set @DT=(select classification   from segment where SegmentLevel=6 and Prodid=@ProdID);

	If (@DT='Detail')

	begin
	if (@AccountName='Apclearing')
	begin

	select a.AccountCode as COANo,COACode,COAID  from COA inner Join tblaccounts a
	on a.AccountId=coa.AccountId   where ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1 
	and	 coa.AccountTypeid=@AccountType and coa.SS1=@CompanyCode
	and COA.COAID  not  in (select isnull(COAID,0)  from AccountClearing  where ClearingType='COA' and AccountName=@AccountName and BankId<>@Bankid)
	end

	else

	begin
	
	select a.AccountCode as COANo,COACode,COAID  from COA inner Join tblaccounts a
	on a.AccountId=coa.AccountId   where ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1 
	and	 coa.AccountTypeid=@AccountType and coa.SS1=@CompanyCode
	and COA.COAID  not  in (select isnull(COAID,0)  from AccountClearing  where ClearingType='COA' and AccountName=@AccountName and CompanyId<>@CompanyId)

	end
	end

	else
	begin
	select SS6 as COANo,COACode,COAID  from COA  where ParentCode=@COACode and ProdID=@ProdID
	end
	end
	else if(@SegmentPosition=6)
	begin
	set @DT=(select classification   from segment where SegmentLevel=7 and Prodid=@ProdID);

	If (@DT='Detail')

	begin
	if (@AccountName='Apclearing')
	begin

	select a.AccountCode as COANo,COACode,COAID  from COA inner Join tblaccounts a
	on a.AccountId=coa.AccountId   where ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1 
	and	 coa.AccountTypeid=@AccountType and coa.SS1=@CompanyCode
	and COA.COAID  not  in (select isnull(COAID,0)  from AccountClearing  where ClearingType='COA' and AccountName=@AccountName and BankId<>@Bankid)
	end

	else

	begin
	
	select a.AccountCode as COANo,COACode,COAID  from COA inner Join tblaccounts a
	on a.AccountId=coa.AccountId   where ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1 
	and	 coa.AccountTypeid=@AccountType and coa.SS1=@CompanyCode
	and COA.COAID  not  in (select isnull(COAID,0)  from AccountClearing  where ClearingType='COA' and AccountName=@AccountName and CompanyId<>@CompanyId)

	end
	end

	else
	begin
	select SS7 as COANo,COACode,COAID  from COA  where ParentCode=@COACode and ProdID=@ProdID
	end
	end
	else if(@SegmentPosition=7)
	begin
	set @DT=(select classification   from segment where SegmentLevel=8 and Prodid=@ProdID);

	If (@DT='Detail')

	begin
	if (@AccountName='Apclearing')
	begin

	select a.AccountCode as COANo,COACode,COAID  from COA inner Join tblaccounts a
	on a.AccountId=coa.AccountId   where ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1 
	and	 coa.AccountTypeid=@AccountType and coa.SS1=@CompanyCode
	and COA.COAID  not  in (select isnull(COAID,0)  from AccountClearing  where ClearingType='COA' and AccountName=@AccountName and BankId<>@Bankid)
	end

	else

	begin
	
	select a.AccountCode as COANo,COACode,COAID  from COA inner Join tblaccounts a
	on a.AccountId=coa.AccountId   where ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1 
	and	 coa.AccountTypeid=@AccountType and coa.SS1=@CompanyCode
	and COA.COAID  not  in (select isnull(COAID,0)  from AccountClearing  where ClearingType='COA' and AccountName=@AccountName and CompanyId<>@CompanyId)

	end
	end

	else
	begin
	select SS8 as COANo,COACode,COAID  from COA  where ParentCode=@COACode and ProdID=@ProdID
	end
end
	end
END





GO
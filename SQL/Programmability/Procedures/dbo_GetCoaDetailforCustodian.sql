SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetCoaDetailforCustodian] -- GetCoaDetailforCustodian '01|30|100',3,2
	-- Add the parameters for the stored procedure here
	@CoaCode nvarchar(50),
	@ProdId int,
	@CustodianId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	
declare @SegmentLevel int
set @SegmentLevel=(select SegmentLevel from Segment where Classification='Detail' and ProdId=@ProdId)

if(@SegmentLevel=2)
begin
select a.AccountCode as COANo,COACode,COAID,a.AccountCode+' ('+a.AccountName+')' as CoaDetail  from COA 
inner Join tblaccounts a	on a.AccountId=coa.AccountId
 where ParentCode=@COACode and coa.AccountTypeid=4 and coa.ProdID=@ProdID and a.Posting=1 and COAID 
 not in(select COAID from Custodian where Prodid=@ProdId 
 and custodianID<>@CustodianId )
  and COAID not in(select isnull(COAID,0)  from AccountClearing  where ClearingType='COA' and AccountName='CashAccount')
  and COAID not in(select isnull(COAID,0) from Recipient where Prodid=@ProdId )
end
else if(@SegmentLevel=3)
begin
select a.AccountCode as COANo,COACode,COAID,a.AccountCode+' ('+a.AccountName+')' as CoaDetail  from COA 
inner Join tblaccounts a	on a.AccountId=coa.AccountId
 where ParentCode=@COACode and COA.ProdID=@ProdID and coa.AccountTypeid=4 and a.Posting=1  and COAID not in(select COAID from Custodian where Prodid=@ProdId
 and custodianID<>@CustodianId )
 and COAID not in(select isnull(COAID,0)  from AccountClearing  where ClearingType='COA' and AccountName='CashAccount')
 and COAID not in(select isnull(COAID,0) from Recipient where Prodid=@ProdId )
end
else if(@SegmentLevel=4)
begin
select a.AccountCode as COANo,COACode,COAID,a.AccountCode+' ('+a.AccountName+')' as CoaDetail  from COA
inner Join tblaccounts a	on a.AccountId=coa.AccountId
  where ParentCode=@COACode and COA.ProdID=@ProdID and coa.AccountTypeid=4 and a.Posting=1  and COAID not in(select COAID from Custodian where Prodid=@ProdId
  and custodianID<>@CustodianId )
  and COAID not in(select isnull(COAID,0)  from AccountClearing  where ClearingType='COA' and AccountName='CashAccount')
  and COAID not in(select isnull(COAID,0) from Recipient where Prodid=@ProdId )
end
else if(@SegmentLevel=5)
begin
select a.AccountCode as COANo,COACode,COAID,a.AccountCode+' ('+a.AccountName+')' as CoaDetail  from COA
inner Join tblaccounts a	on a.AccountId=coa.AccountId
 where ParentCode=@COACode and COA.ProdID=@ProdID and coa.AccountTypeid=4 and a.Posting=1  and COAID not in(select COAID from Custodian where Prodid=@ProdId
 and custodianID<>@CustodianId )
 and COAID not in(select isnull(COAID,0)  from AccountClearing  where ClearingType='COA' and AccountName='CashAccount')
 and COAID not in(select isnull(COAID,0) from Recipient where Prodid=@ProdId )
end
else if(@SegmentLevel=6)
begin
select a.AccountCode as COANo,COACode,COAID,a.AccountCode+' ('+a.AccountName+')' as CoaDetail  from COA 
inner Join tblaccounts a	on a.AccountId=coa.AccountId
 where ParentCode=@COACode and COA.ProdID=@ProdID and coa.AccountTypeid=4 and a.Posting=1 and COAID not in(select COAID from Custodian where Prodid=@ProdId
 and custodianID<>@CustodianId )
 and COAID not in(select isnull(COAID,0)  from AccountClearing  where ClearingType='COA' and AccountName='CashAccount')
 and COAID not in(select isnull(COAID,0) from Recipient where Prodid=@ProdId )
end
else if(@SegmentLevel=7)
begin
select a.AccountCode as COANo,COACode,COAID,a.AccountCode+' ('+a.AccountName+')' as CoaDetail  from COA 
inner Join tblaccounts a	on a.AccountId=coa.AccountId
 where ParentCode=@COACode and COA.ProdID=@ProdID and coa.AccountTypeid=4 and a.Posting=1  and COAID not in(select COAID from Custodian where Prodid=@ProdId
 and custodianID<>@CustodianId )
 and COAID not in(select isnull(COAID,0)  from AccountClearing  where ClearingType='COA' and AccountName='CashAccount')
 and COAID not in(select isnull(COAID,0) from Recipient where Prodid=@ProdId )
end
else if(@SegmentLevel=8)
begin
select a.AccountCode as COANo,COACode,COAID,a.AccountCode+' ('+a.AccountName+')' as CoaDetail  from COA
inner Join tblaccounts a	on a.AccountId=coa.AccountId
  where ParentCode=@COACode and COA.ProdID=@ProdID and coa.AccountTypeid=4 and a.Posting=1  and COAID not in(select COAID from Custodian where Prodid=@ProdId
  and custodianID<>@CustodianId )
  and COAID not in(select isnull(COAID,0)  from AccountClearing  where ClearingType='COA' and AccountName='CashAccount')
  and COAID not in(select isnull(COAID,0) from Recipient where Prodid=@ProdId )
end
else
begin
select 0 COANo,0 COACode,0 COAID 
end
END



GO
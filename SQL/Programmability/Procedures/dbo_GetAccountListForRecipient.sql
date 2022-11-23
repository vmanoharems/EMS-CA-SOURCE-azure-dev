SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetAccountListForRecipient] -- GetAccountListForRecipient 1
	-- Add the parameters for the stored procedure here
	@CoaCode nvarchar(50),
	@ProdId int,
	@RecipientId int
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
select a.AccountCode as COANo,COACode,COAID  from COA 
inner Join tblaccounts a	on a.AccountId=coa.AccountId
 where ParentCode=@COACode and coa.AccountTypeid=4 and coa.ProdID=@ProdID and COAID not in(select COAID from Recipient where Prodid=@ProdId 
 and RecipientID<>@RecipientId  )
  and COAID not in(select isnull(COAID,0)  from AccountClearing  where ClearingType='COA' and AccountName='CashAccount')
  and COAID not in(select isnull(COAID,0) from Custodian where Prodid=@ProdId )
end
else if(@SegmentLevel=3)
begin
select a.AccountCode as COANo,COACode,COAID  from COA 
inner Join tblaccounts a	on a.AccountId=coa.AccountId
 where ParentCode=@COACode and coa.AccountTypeid=4 and coa.ProdID=@ProdID and COAID not in(select COAID from Recipient where Prodid=@ProdId 
 and RecipientID<>@RecipientId  )
  and COAID not in(select isnull(COAID,0)  from AccountClearing  where ClearingType='COA' and AccountName='CashAccount')
  and COAID not in(select isnull(COAID,0) from Custodian where Prodid=@ProdId )
end
else if(@SegmentLevel=4)
begin
select a.AccountCode as COANo,COACode,COAID  from COA 
inner Join tblaccounts a	on a.AccountId=coa.AccountId
 where ParentCode=@COACode and coa.AccountTypeid=4 and coa.ProdID=@ProdID and COAID not in(select COAID from Recipient where Prodid=@ProdId 
 and RecipientID<>@RecipientId  )
  and COAID not in(select isnull(COAID,0)  from AccountClearing  where ClearingType='COA' and AccountName='CashAccount')
  and COAID not in(select isnull(COAID,0) from Custodian where Prodid=@ProdId )
end
else if(@SegmentLevel=5)
begin
select a.AccountCode as COANo,COACode,COAID  from COA 
inner Join tblaccounts a	on a.AccountId=coa.AccountId
 where ParentCode=@COACode and coa.AccountTypeid=4 and coa.ProdID=@ProdID and COAID not in(select COAID from Recipient where Prodid=@ProdId 
 and RecipientID<>@RecipientId  )
  and COAID not in(select isnull(COAID,0)  from AccountClearing  where ClearingType='COA' and AccountName='CashAccount')
  and COAID not in(select isnull(COAID,0) from Custodian where Prodid=@ProdId )
end
else if(@SegmentLevel=6)
begin
select a.AccountCode as COANo,COACode,COAID  from COA 
inner Join tblaccounts a	on a.AccountId=coa.AccountId
 where ParentCode=@COACode and coa.AccountTypeid=4 and coa.ProdID=@ProdID and COAID not in(select COAID from Recipient where Prodid=@ProdId 
 and RecipientID<>@RecipientId  )
  and COAID not in(select isnull(COAID,0)  from AccountClearing  where ClearingType='COA' and AccountName='CashAccount')
  and COAID not in(select isnull(COAID,0) from Custodian where Prodid=@ProdId )
end
else if(@SegmentLevel=7)
begin
select a.AccountCode as COANo,COACode,COAID  from COA 
inner Join tblaccounts a	on a.AccountId=coa.AccountId
 where ParentCode=@COACode and coa.AccountTypeid=4 and coa.ProdID=@ProdID and COAID not in(select COAID from Recipient where Prodid=@ProdId 
 and RecipientID<>@RecipientId  )
  and COAID not in(select isnull(COAID,0)  from AccountClearing  where ClearingType='COA' and AccountName='CashAccount')
  and COAID not in(select isnull(COAID,0) from Custodian where Prodid=@ProdId )
end
else if(@SegmentLevel=8)
begin
select a.AccountCode as COANo,COACode,COAID  from COA 
inner Join tblaccounts a	on a.AccountId=coa.AccountId
 where ParentCode=@COACode and coa.AccountTypeid=4 and coa.ProdID=@ProdID and COAID not in(select COAID from Recipient where Prodid=@ProdId 
 and RecipientID<>@RecipientId  )
  and COAID not in(select isnull(COAID,0)  from AccountClearing  where ClearingType='COA' and AccountName='CashAccount')
  and COAID not in(select isnull(COAID,0) from Custodian where Prodid=@ProdId )
end
else
begin
select 0 COANo,0 COACode,0 COAID 
end
END



GO
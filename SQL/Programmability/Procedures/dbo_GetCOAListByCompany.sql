SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetCOAListByCompany] -- GetCOAListByCompany '01','1' 
	-- Add the parameters for the stored procedure here
	@ProdId int,
	@CodeString nvarchar(150)
	
AS
BEGIN
	
	SET NOCOUNT ON;

    -- Insert statements for procedure here
declare @Detail int
set @Detail=(	select SegmentLevel from Segment where Classification='Detail')


If @Detail=3 
begin 
select ss3 as Detail,t.AccountName as Descriptions,t.Posting,isnull(a.Code,'-') as AccountType ,c.COAID,c.AccountId,
C.Description as ReportDescription,T.SubLevel
 From COA C
inner join TblAccounts T on C.AccountId=t.AccountId
left outer join AccountType A on t.AccountTypeId=a.AccountTypeID
 where   
 COACode like  @CodeString+'%' and
   t.ProdId=@ProdId order by Detail asc
	
end

else if @Detail=4

begin 
select ss4 as Detail,t.AccountName as Descriptions,t.Posting,isnull(a.Code,'-') as AccountType ,c.COAID,c.AccountId,C.Description as ReportDescription
,T.SubLevel From COA C
inner join TblAccounts T on C.AccountId=t.AccountId
left outer join AccountType A on a.AccountTypeID=t.AccountTypeId
 where   
   COACode like  @CodeString+'%' and    t.ProdId=@ProdId order by Detail asc
	
end


else if @Detail=5

begin 
select ss5 as Detail,t.AccountName as Descriptions,t.Posting,isnull(a.Code,'-') as AccountType ,c.COAID,c.AccountId,C.Description as ReportDescription 
,T.SubLevel From COA C
inner join TblAccounts T on C.AccountId=t.AccountId
left outer join AccountType A on a.AccountTypeID=t.AccountTypeId
 where   
   COACode like  @CodeString+'%' and t.ProdId=@ProdId order by Detail asc
	
end		


else if @Detail=6

begin 
select ss6 as Detail,t.AccountName as Descriptions,t.Posting,isnull(a.Code,'-') as AccountType ,c.COAID,c.AccountId,C.Description as ReportDescription ,T.SubLevel From COA C
inner join TblAccounts T on C.AccountId=t.AccountId
left outer join AccountType A on a.AccountTypeID=t.AccountTypeId
 where   
 COACode like  @CodeString+'%' and t.ProdId=@ProdId order by Detail asc
	
end			
else if @Detail=7

begin 
select ss7 as Detail,t.AccountName as Descriptions,t.Posting,isnull(a.Code,'-') as AccountType ,c.COAID,c.AccountId,C.Description as ReportDescription  ,T.SubLevel From COA C
inner join TblAccounts T on C.AccountId=t.AccountId
left outer join AccountType A on a.AccountTypeID=t.AccountTypeId
 where   
   COACode like  @CodeString+'%' and t.ProdId=@ProdId order by Detail asc
	
end			 
else if @Detail=8

begin 
select ss8 as Detail,t.AccountName as Descriptions,t.Posting,isnull(a.Code,'-') as AccountType ,c.COAID,c.AccountId,C.Description as ReportDescription ,T.SubLevel From COA C
inner join TblAccounts T on C.AccountId=t.AccountId
left outer join AccountType A on a.AccountTypeID=t.AccountTypeId
 where   
    COACode like  @CodeString+'%' and t.ProdId=@ProdId order by Detail asc
	 
end			  
	

END








GO
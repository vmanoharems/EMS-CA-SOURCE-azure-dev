SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

-- =============================================
CREATE procedure  [dbo].[GenerateDefaultAccounts]
   --ON  dbo.Segment
   --AFTER UPDATE
AS 
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    
declare @seglevel int 
declare @Prodid int


set @seglevel=(select SegmentLevel  from Segment  where Classification='Detail')
set @Prodid=(select ProdId  from Segment  where Classification='Detail')

insert into TblAccounts

select   SegmentId,case when CodeLength='#' then '0' when CodeLength='##' then '00' when CodeLength='###' then '000' else '0000' end as Accountcode,
'Default' +' '+Classification as AccountName,null as Accounttypeid,null as BalanceSheet,0 as Status,null as Posting,null as Sublevel,Classification as SegmentType,
null as Parentid,getdate() as CreatedDate,1 as CreatedBy,null as Modifieddate,null as Modifiedby,ProdId  from segment  where segmentid in (select SegmentId  from segment where Classification not in ('Company' ,'Detail'))
and SegmentLevel<@seglevel and ProdId=@Prodid



END




GO
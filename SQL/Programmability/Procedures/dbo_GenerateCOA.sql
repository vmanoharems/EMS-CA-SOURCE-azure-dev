SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO




CREATE PROCEDURE [dbo].[GenerateCOA]
	-- Add the parameters for the stored procedure here
@ProdID int,
@s1 nvarchar(max),
@s2 nvarchar(max),
@s3 nvarchar(max),
@s4 nvarchar(max),
@s5 nvarchar(max),
@s6 nvarchar(max),
@s7 nvarchar(max),
@s8 nvarchar(max)

AS
Begin    
declare @COACode nvarchar(200)
declare @Parent nvarchar(200)
declare @AccountID int
declare @SegmentID int
declare @detail int
declare @c1 nvarchar(20)
declare @c2 nvarchar(20)
declare @c3 nvarchar(20)
declare @c4 nvarchar(20)
declare @c5 nvarchar(20)
declare @c6 nvarchar(20)
declare @c7 nvarchar(20)
declare @c8 nvarchar(20)


select @detail=segmentlevel  from Segment  where Classification='Detail' and ProdId=@ProdID;


--

with 
--Segment1 as (SELECT items as S1 FROM dbo.SplitId(@s1,',')),
 Segment1 as ( SELECT RIGHT(items,LEN(items)-CHARINDEX(':',items)) as S11, LEFT(items, CHARINDEX(':', items) - 1) as S1 FROM dbo.SplitId(@s1,',')),
---------------------------------------s1
 Segment2 as ( SELECT RIGHT(items,LEN(items)-CHARINDEX(':',items)) as S22, LEFT(items, CHARINDEX(':', items) - 1) as S2 FROM dbo.SplitId(@s2,',')),

---------------------------------------s2
Segment3 as ( SELECT RIGHT(items,LEN(items)-CHARINDEX(':',items)) as S33, LEFT(items, CHARINDEX(':', items) - 1) as S3 FROM dbo.SplitId(@s3,',')),
---------------------------------------s3
Segment4 as ( SELECT RIGHT(items,LEN(items)-CHARINDEX(':',items)) as S44, LEFT(items, CHARINDEX(':', items) - 1) as S4 FROM dbo.SplitId(@s4,',')),
---------------------------------------s4
Segment5 as ( SELECT RIGHT(items,LEN(items)-CHARINDEX(':',items)) as S55, LEFT(items, CHARINDEX(':', items) - 1) as S5 FROM dbo.SplitId(@s5,',')),
---------------------------------------s5
Segment6 as ( SELECT RIGHT(items,LEN(items)-CHARINDEX(':',items)) as S66, LEFT(items, CHARINDEX(':', items) - 1) as S6 FROM dbo.SplitId(@s6,',')),
---------------------------------------s6
Segment7 as ( SELECT RIGHT(items,LEN(items)-CHARINDEX(':',items)) as S77, LEFT(items, CHARINDEX(':', items) - 1) as S7 FROM dbo.SplitId(@s7,',')),
---------------------------------------s7
Segment8 as ( SELECT RIGHT(items,LEN(items)-CHARINDEX(':',items)) as S88, LEFT(items, CHARINDEX(':', items) - 1) as S8 FROM dbo.SplitId(@s8,','))
  -------------------------------------s8

 insert into COA 

  select S1+'|'+S2+'|'+S3+'|'+S4+'|'+S5+'|'+S6+'|'+S7+'|'+S8 as COACode,S1+'|'+S2+'|'+S3+'|'+S4+'|'+S5+'|'+S6+'|'+S7 as Parent,''as des,
  S1,S2,S3,S4,S5,S6,S7,S8 ,@ProdID,0 as DetailLevel,s88,(select isnull(AccountTypeID,0) from TblAccounts 
  where AccountId=s88) as AccountTypeid from Segment1   cross join Segment2 cross join Segment3 cross join 
		 Segment4 cross join Segment5 cross join Segment6 cross join Segment7 cross Join Segment8

Union

select S1+'|'+S2+'|'+S3+'|'+S4+'|'+S5+'|'+S6+'|'+S7 as COACode,S1+'|'+S2+'|'+S3+'|'+S4+'|'+S5+'|'+S6 as Parent,''as des, S1,S2,S3,S4,S5,S6,S7,'' as S8 ,@ProdID,0 as DetailLevel,s77,(select isnull(AccountTypeID,0) from TblAccounts 
  where AccountId=s77) as AccountTypeid from Segment1   
                              cross join Segment2 cross join Segment3 cross join Segment4 
                            cross join Segment5 cross join Segment6 cross join Segment7

     union

select S1+'|'+S2+'|'+S3+'|'+S4+'|'+S5+'|'+S6 as COACode,S1+'|'+S2+'|'+S3+'|'+S4+'|'+S5 as Parent,''as des, S1,S2,S3,S4,S5,S6,'' as S7,'' as S8  ,@ProdID,0 as DetailLevel,s66,(select isnull(AccountTypeID,0) from TblAccounts 
  where AccountId=s66) as AccountTypeid from Segment1   
                              cross join Segment2 cross join Segment3 cross join Segment4 
                            cross join Segment5 cross join Segment6 
     union
select S1+'|'+S2+'|'+S3+'|'+S4+'|'+S5 as COACode,S1+'|'+S2+'|'+S3+'|'+S4 as Parent,''as des,S1,S2,S3,S4,S5,'' as S6,'' as S7  ,''as des ,@ProdID,0 as DetailLevel,s55,(select isnull(AccountTypeID,0) from TblAccounts 
  where AccountId=s55) as AccountTypeid from Segment1   
                              cross join Segment2 cross join Segment3 cross join Segment4 
                            cross join Segment5 
     union
select S1+'|'+S2+'|'+S3+'|'+S4 as COACode,S1+'|'+S2+'|'+S3 as Parent,''as des,S1,S2,S3,S4,'' as S5,'' as S6,'' as S7  ,''as des ,@ProdID,0 as DetailLevel,s44,(select isnull(AccountTypeID,0) from TblAccounts 
  where AccountId=s44) as AccountTypeid from Segment1   
                              cross join Segment2 cross join Segment3 cross join Segment4 
                            
                            
           union
select S1+'|'+S2+'|'+S3 as COACode,S1+'|'+S2 as Parent,''as des,S1,S2,S3,'' as S4,'' as S5,'' as S6,'' as S7  ,''as des ,@ProdID,0 as DetailLevel,s33,(select isnull(AccountTypeID,0) from TblAccounts 
  where AccountId=s33) as AccountTypeid from Segment1   
                              cross join Segment2 cross join Segment3 
           union
select S1+'|'+S2 as COACode,S1 as Parent,''as des, S1,S2,'' as S3,'' as S4 ,'' as S5,'' as S6,'' as S7,'' as S8  ,@ProdID,0 as DetailLevel,s22,(select isnull(AccountTypeID,0) from TblAccounts 
  where AccountId=s22) as AccountTypeid  from Segment1   
                              cross join Segment2 
           union
select S1 as COACode,'' as Parent,''as des,S1,'' as S2,'' as S3,'' as S4 ,'' as S5,'' as S6,'' as S7,'' as S8 ,@ProdID,0 as DetailLevel,s11,(select isnull(AccountTypeID,0) from TblAccounts 
  where AccountId=S11) as AccountTypeid from Segment1   
                                
 order by COACode  asc


 if (@detail=3)
 begin

 update coa set detaillevel= (case when  SS3 not like  '%>%'  then 1 
 when SS3 like '%>%' and SS3 not like  '%>%>%'  then 2 
 when SS3 like '%>%>%' and SS3 not like '%>%>%>%' then 3 
 when SS3 like '%>%>%>%' and SS3 not like '%>%>%>%>%' then 4
 when SS3 like '%>%>%>%>%'  and SS3 not like '%>%>%>%>%>%' then 5 
 when SS3 like '%>%>%>%>%>%'  and SS3 not like '%>%>%>%>%>%>%' then 6 end) 
 where SS3<>'' and ProdID=@Prodid

 end

 else if (@detail=4)

 begin
 update coa set detaillevel= (case when  SS4 not like  '%>%'  then 1 
 when SS4 like '%>%' and SS4 not like  '%>%>%'  then 2 
 when SS4 like '%>%>%' and SS4 not like '%>%>%>%' then 3 
 when SS4 like '%>%>%>%' and SS4 not like '%>%>%>%>%' then 4
 when SS4 like '%>%>%>%>%'  and SS4 not like '%>%>%>%>%>%' then 5 
 when SS4 like '%>%>%>%>%>%'  and SS4 not like '%>%>%>%>%>%>%' then 6 end) 
 where SS4<>'' and ProdID=@Prodid
 end

 else if (@detail=5)
   
 begin
 update coa set detaillevel= (case when  SS5 not like  '%>%'  then 1 
 when SS5 like '%>%' and SS4 not like  '%>%>%'  then 2 
 when SS5 like '%>%>%' and SS4 not like '%>%>%>%' then 3 
 when SS5 like '%>%>%>%' and SS4 not like '%>%>%>%>%' then 4
 when SS5 like '%>%>%>%>%'  and SS4 not like '%>%>%>%>%>%' then 5 
 when SS5 like '%>%>%>%>%>%'  and SS4 not like '%>%>%>%>%>%>%' then 6 end) 
 where SS5<>'' and ProdID=@Prodid
 end

 else if (@detail=6)

 begin
  update coa set detaillevel= (case when  SS6 not like  '%>%'  then 1 
 when SS6 like '%>%' and SS6 not like  '%>%>%'  then 2 
 when SS6 like '%>%>%' and SS6 not like '%>%>%>%' then 3 
 when SS6 like '%>%>%>%' and SS6 not like '%>%>%>%>%' then 4
 when SS6 like '%>%>%>%>%'  and SS6 not like '%>%>%>%>%>%' then 5 
 when SS6 like '%>%>%>%>%>%'  and SS6 not like '%>%>%>%>%>%>%' then 6 end) 
 where SS6<>'' and ProdID=@Prodid
 end
 else if (@detail=7)

 begin
  update coa set detaillevel= (case when  SS7 not like  '%>%'  then 1 
 when SS7 like '%>%' and SS7 not like  '%>%>%'  then 2 
 when SS7 like '%>%>%' and SS7 not like '%>%>%>%' then 3 
 when SS7 like '%>%>%>%' and SS7 not like '%>%>%>%>%' then 4
 when SS7 like '%>%>%>%>%'  and SS7 not like '%>%>%>%>%>%' then 5 
 when SS7 like '%>%>%>%>%>%'  and SS7 not like '%>%>%>%>%>%>%' then 6 end) 
 where SS7<>'' and ProdID=@Prodid
 end

 else if (@detail=8)

 begin
  update coa set detaillevel= (case when  SS8 not like  '%>%'  then 1 
 when SS8 like '%>%' and SS8 not like  '%>%>%'  then 2 
 when SS8 like '%>%>%' and SS8 not like '%>%>%>%' then 3 
 when SS8 like '%>%>%>%' and SS8 not like '%>%>%>%>%' then 4
 when SS8 like '%>%>%>%>%'  and SS8 not like '%>%>%>%>%>%' then 5 
 when SS8 like '%>%>%>%>%>%'  and SS8 not like '%>%>%>%>%>%>%' then 6 end) 
 where SS8<>'' and ProdID=@Prodid
 end

 --exec correctCOAforASSetLiability

 end







GO
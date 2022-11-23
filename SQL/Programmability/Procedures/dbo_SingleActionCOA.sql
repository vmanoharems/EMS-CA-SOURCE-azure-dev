SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE Proc [dbo].[SingleActionCOA]
(
@Accountid int
)
As
begin

declare @ProdID int,@s1 nvarchar(max),@s2 nvarchar(max),@s3 nvarchar(max),@s4 nvarchar(max),@s5 nvarchar(max),@s6 nvarchar(max),@s7 nvarchar(max),@s8 nvarchar(max),
@SegmentType nvarchar(20), @SegmentLevel int,@ss nvarchar(max)


select @SegmentType=SegmentType,@SegmentLevel=SegmentLevel,@ProdID=B.ProdId from TblAccounts a inner Join Segment b
 on  a.SegmentId=b.SegmentId  where  accountid=@Accountid;
 
declare @Classification varchar(100), @SegLevel int

select @s1=coalesce(@s1 + ',', '') +  convert(varchar(max),(Accountcode+':'+cast(AccountId AS VARCHAR(20)) )) from TblAccounts a inner Join Segment b on a.SegmentId=b.SegmentId
  where  b.SegmentLevel=1 and a.SegmentType not in ('Set','Series');

select @s2=coalesce(@s2 + ',', '') +  convert(varchar(max),(Accountcode+':'+cast(AccountId AS VARCHAR(20)) ))  from TblAccounts a inner Join Segment b on a.SegmentId=b.SegmentId
  where  b.SegmentLevel=2  and a.SegmentType not in ('Set','Series');


select @s3=coalesce(@s3 + ',', '') +  convert(varchar(max),(Accountcode+':'+cast(AccountId AS VARCHAR(20)) ))  from TblAccounts a inner Join Segment b on a.SegmentId=b.SegmentId
  where  b.SegmentLevel=3  and a.SegmentType not in ('Set','Series');
  
select @s4=coalesce(@s4 + ',', '') +  convert(varchar(max),(Accountcode+':'+cast(AccountId AS VARCHAR(20)) ))  from TblAccounts a inner Join Segment b on a.SegmentId=b.SegmentId
  where  b.SegmentLevel=4   and a.SegmentType not in ('Set','Series');

  
select @s5=coalesce(@s5 + ',', '') +  convert(varchar(max),(Accountcode+':'+cast(AccountId AS VARCHAR(20)) ))  from TblAccounts a inner Join Segment b on a.SegmentId=b.SegmentId
  where  b.SegmentLevel=5   and a.SegmentType not in ('Set','Series');
  
select @s6=coalesce(@s6 + ',', '') +  convert(varchar(max),(Accountcode+':'+cast(AccountId AS VARCHAR(20)) ))  from TblAccounts a inner Join Segment b on a.SegmentId=b.SegmentId
  where  b.SegmentLevel=6 and a.SegmentType not in ('Set','Series');

  
select @s7=coalesce(@s7 + ',', '') +  convert(varchar(max),(Accountcode+':'+cast(AccountId AS VARCHAR(20)) ))  from TblAccounts a inner Join Segment b on a.SegmentId=b.SegmentId
  where  b.SegmentLevel=7 and a.SegmentType not in ('Set','Series');

  
select @s8=coalesce(@s8 + ',', '') +  convert(varchar(max),(Accountcode+':'+cast(AccountId AS VARCHAR(20)) ))   from TblAccounts a inner Join Segment b on a.SegmentId=b.SegmentId
  where  b.SegmentLevel=8 and a.SegmentType not in ('Set','Series');

  if (@SegmentType='Detail')

  begin


  declare @TEMP table (Accountid int, Accountcode nvarchar(100),AccountName nvarchar(100),BalanceSheet bit,[Status] bit,Posting bit,
  Sublevel int,Code varchar(5),Accounttypeid int,Parent int)
insert into @TEMP 

exec GetTblAccountDetailsByCategory @ProdID,'Detail'

select @ss=Accountcode+':'+cast(AccountId AS VARCHAR(20)) from @TEMP  where  Accountid=@accountid

If (@SegmentLevel=2)
begin
set @s2=@ss;
end
else if (@SegmentLevel=3)

begin
set @s3=@ss;
end
else if (@SegmentLevel=4)
begin
set @s4=@ss;
end

else if (@SegmentLevel=5)

begin
set @s5=@ss;
end

else if (@SegmentLevel=6)

begin
set @s6=@ss;
end

else if (@SegmentLevel=7)

begin
set @s7=@ss;
end

else if (@SegmentLevel=8)

begin

set @s8=@ss;
end


  end

  ELSE 

  BEGIN

  declare @TEMP1 table (Accountid int, Accountcode nvarchar(100),AccountName nvarchar(100),BalanceSheet bit,[Status] bit,Posting bit,
  Sublevel int,Code varchar(5),Accounttypeid int,Parent int)
insert into @TEMP1 

exec GetTblAccountDetailsByCategory @ProdID,'Detail'
select @ss=coalesce(@ss + ',', '') +  convert(varchar(max),(Accountcode+':'+cast(AccountId AS VARCHAR(20)) )) from @TEMP1;  

  END

  Declare @dtlevel int 

  select @dtlevel=SegmentLevel  from Segment  where Classification='Detail';

  If (@dtlevel=2)
begin
set @s2=@ss;
end
else if (@dtlevel=3)

begin
set @s3=@ss;
end
else if (@dtlevel=4)
begin
set @s4=@ss;
end

else if (@dtlevel=5)

begin
set @s5=@ss;
end

else if (@dtlevel=6)

begin
set @s6=@ss;
end

else if (@dtlevel=7)

begin
set @s7=@ss;
end

else if (@dtlevel=8)

begin

set @s8=@ss;
end

 exec [GenerateCOA] @ProdID,@s1,@s2,@s3,@s4,@S5,@S6,@s7,@s8;
end

GO